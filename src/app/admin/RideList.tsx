"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import { api } from "@/lib/api";
import {
  careLevelOptions,
  formatDateTime,
  formatMoney,
  labelOf,
  tripKindOptions,
  type BookingStatus,
} from "@/lib/booking";
import {
  formatDayHeading,
  formatTime,
  PAGE_SIZE,
  rideFiltersHref,
  rideListQuery,
  shortAddress,
  staffStatusLabel,
  statusFilterOptions,
  tampaDate,
  type RideFilters,
  type StaffBookingList,
  type StaffBookingSummary,
} from "@/lib/staff";

// Token colors per status. "Needs confirmation" stands out: it's the work.
const badgeClass: Record<BookingStatus, string> = {
  REQUESTED: "bg-secondary text-white",
  CONFIRMED: "bg-accent/10 text-accent",
  COMPLETED: "bg-surface text-muted",
  CANCELLED: "bg-surface text-muted",
  NO_SHOW: "bg-danger/10 text-danger",
  PENDING_PAYMENT: "bg-surface text-muted",
};

const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${badgeClass[status]}`}
  >
    {staffStatusLabel[status]}
  </span>
);

const RideRow = ({
  ride,
  showDate,
}: {
  ride: StaffBookingSummary;
  showDate: boolean;
}) => {
  const ret = ride.returnLeg;
  return (
    <li className="grid gap-x-6 gap-y-2 py-4 md:grid-cols-[9rem_1fr_1.4fr_10rem] md:items-start">
      <div>
        <p className="font-heading text-lg font-bold text-primary">
          {showDate ? formatDateTime(ride.pickupAt) : formatTime(ride.pickupAt)}
        </p>
        <p className="font-mono text-sm text-muted">{ride.reference}</p>
      </div>
      <div>
        <p className="font-semibold text-ink">
          {ride.rider.firstName} {ride.rider.lastName}
        </p>
        <p className="text-sm text-muted">
          {labelOf(careLevelOptions, ride.careLevel)} ·{" "}
          {labelOf(tripKindOptions, ride.tripKind)}
        </p>
      </div>
      <div className="text-sm">
        <p>
          <span className="text-muted">From </span>
          {shortAddress(ride.pickup)}
        </p>
        <p>
          <span className="text-muted">To </span>
          {shortAddress(ride.dropoff)}
        </p>
        {ret && (
          <p className="text-muted">
            Return:{" "}
            {ret.willCall
              ? "will call"
              : ret.pickupAt
                ? formatTime(ret.pickupAt)
                : "time not set"}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 md:flex-col md:items-end">
        <StatusBadge status={ride.status} />
        <p className="text-sm text-muted">{formatMoney(ride.totalCents)}</p>
      </div>
    </li>
  );
};

// Rides grouped under a heading per Tampa day, in pickup order.
const groupByDay = (rides: StaffBookingSummary[]) => {
  const groups: { date: string; rides: StaffBookingSummary[] }[] = [];
  for (const ride of rides) {
    const date = tampaDate(ride.pickupAt);
    const last = groups.at(-1);
    if (last?.date === date) last.rides.push(ride);
    else groups.push({ date, rides: [ride] });
  }
  return groups;
};

const Filters = ({ filters }: { filters: RideFilters }) => (
  // GET form: the filters go in the URL (/admin?status=…), so refreshing or
  // sharing the link keeps them. key: reset the fields when the URL changes.
  <Form
    action="/admin"
    key={rideFiltersHref(filters)}
    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1.4fr_1fr_1fr_1.3fr]"
  >
    <div>
      <label htmlFor="q" className="form-label">
        Search
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={filters.q}
        placeholder="Reference or last name"
        aria-describedby="q-hint"
        className="form-input"
      />
      <p id="q-hint" className="sr-only">
        A booking reference, or the rider&apos;s exact last name. Searches every
        date.
      </p>
    </div>
    <div>
      <label htmlFor="status" className="form-label">
        Status
      </label>
      <select
        id="status"
        name="status"
        defaultValue={filters.status ?? ""}
        className="form-input"
      >
        <option value="">All</option>
        {statusFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="from" className="form-label">
        Pickup from
      </label>
      <input
        id="from"
        name="from"
        type="date"
        defaultValue={filters.from}
        className="form-input"
      />
    </div>
    <div>
      <label htmlFor="to" className="form-label">
        Pickup to
      </label>
      <input
        id="to"
        name="to"
        type="date"
        defaultValue={filters.to}
        className="form-input"
      />
    </div>
    <div>
      <label htmlFor="sort" className="form-label">
        Order
      </label>
      <select
        id="sort"
        name="sort"
        defaultValue={filters.sort}
        className="form-input"
      >
        <option value="pickup">Pickup time</option>
        <option value="newest">Newest requests</option>
      </select>
    </div>
    <div className="flex gap-3 sm:col-span-2 lg:col-span-5">
      <Button type="submit">Show rides</Button>
      <Button href="/admin" variant="outline">
        Clear
      </Button>
    </div>
  </Form>
);

// What the list is showing, in words, e.g. "Upcoming rides" or "Search results".
const describe = (filters: RideFilters) => {
  if (filters.q) return `Search results for “${filters.q}”`;
  if (!filters.from && !filters.to) return "Upcoming rides, from today";
  return "Rides";
};

// The staff ride list: filters, then rides by day. No automatic refresh:
// that would keep the session alive forever and defeat the 15-minute
// automatic sign-out. Staff press Refresh instead.
const RideList = ({ filters }: { filters: RideFilters }) => {
  const router = useRouter();
  const query = rideListQuery(filters);
  const pageHref = rideFiltersHref(filters);
  const [result, setResult] = useState<{
    query: string;
    list?: StaffBookingList;
    error?: string;
  }>();
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    let active = true;
    api<StaffBookingList>(query).then((response) => {
      if (!active) return;
      if (response.ok) setResult({ query, list: response.data });
      else if (response.status === 401) {
        // Signed out after 15 idle minutes: sign in again, then come back.
        router.replace(`/admin/login?next=${encodeURIComponent(pageHref)}`);
      } else setResult({ query, error: response.message });
    });
    return () => {
      active = false;
    };
  }, [query, pageHref, reloads, router]);

  const loading = result?.query !== query;
  const list = loading ? undefined : result?.list;
  const byDay = filters.sort === "pickup";
  const first = list ? (list.page - 1) * list.pageSize + 1 : 0;
  const last = list ? first + list.bookings.length - 1 : 0;

  return (
    <div className="card space-y-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="card-title">{describe(filters)}</h2>
        <Button
          variant="link"
          onClick={() => setReloads((count) => count + 1)}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      <Filters filters={filters} />

      {!loading && result?.error && <FormAlert>{result.error}</FormAlert>}

      {loading && (
        <p role="status" className="text-muted">
          Loading rides…
        </p>
      )}

      {list && list.bookings.length === 0 && (
        <p role="status" className="text-muted">
          {filters.q
            ? "No bookings match. Last names have to match exactly."
            : "No rides here."}
        </p>
      )}

      {list && list.bookings.length > 0 && (
        <>
          <p role="status" className="text-sm text-muted">
            Showing {first}–{last} of {list.total}
          </p>

          {byDay ? (
            groupByDay(list.bookings).map((group) => (
              <section key={group.date} aria-labelledby={`day-${group.date}`}>
                <h3
                  id={`day-${group.date}`}
                  className="border-b border-line pb-2 font-heading text-base font-bold text-primary"
                >
                  {formatDayHeading(group.date)}
                </h3>
                <ul className="divide-y divide-line">
                  {group.rides.map((ride) => (
                    <RideRow key={ride.id} ride={ride} showDate={false} />
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <ul className="divide-y divide-line">
              {list.bookings.map((ride) => (
                <RideRow key={ride.id} ride={ride} showDate />
              ))}
            </ul>
          )}

          {list.total > PAGE_SIZE && (
            <nav
              aria-label="Pages"
              className="flex items-center justify-between gap-4 border-t border-line pt-4"
            >
              {filters.page > 1 ? (
                <Link
                  href={rideFiltersHref({ ...filters, page: filters.page - 1 })}
                  className="link-arrow"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              {last < list.total && (
                <Link
                  href={rideFiltersHref({ ...filters, page: filters.page + 1 })}
                  className="link-arrow"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default RideList;
