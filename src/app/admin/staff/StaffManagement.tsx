"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import Field, { describedBy } from "@/components/form/Field";
import { api, type Staff } from "@/lib/api";
import { formatDateTime } from "@/lib/booking";
import {
  roleLabel,
  type StaffLinkResult,
  type StaffMember,
  type StaffOverview,
} from "@/lib/staff";
import { useSignedIn } from "@/lib/useSignedIn";

type Pending = {
  memberId: string;
  action: "deactivate" | "reset-sign-in" | "promote" | "demote";
} | null;

const CONFIRM: Record<
  NonNullable<Pending>["action"],
  (name: string) => string
> = {
  deactivate: (name) =>
    `Deactivate ${name}? They're signed out right away and can't sign in until reactivated.`,
  "reset-sign-in": (name) =>
    `Reset ${name}'s sign-in? They'll get a link to choose a new password. Their current password keeps working until they use it.`,
  promote: (name) =>
    `Make ${name} an administrator? They'll be able to manage staff and waive fees.`,
  demote: (name) =>
    `Make ${name} a dispatcher? They'll lose administrator access.`,
};

// A one-time link, shown after an invite or reset in case the email doesn't
// arrive (they can also be texted).
const LinkBox = ({ result, to }: { result: StaffLinkResult; to: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-3 rounded-card border border-line bg-surface p-5">
      <p className="text-ink">
        {result.emailed
          ? `We emailed the link to ${to}.`
          : `We couldn't email ${to}. Send them this link yourself.`}{" "}
        It works once and expires {formatDateTime(result.expiresAt)}.
      </p>
      <p className="break-all rounded-button border border-line bg-white px-3 py-2 font-mono text-sm text-ink">
        {result.link}
      </p>
      <Button
        variant="outline"
        onClick={() => {
          void navigator.clipboard
            .writeText(result.link)
            .then(() => setCopied(true));
        }}
      >
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
};

const MemberRow = ({
  member,
  isYou,
  busy,
  pending,
  onAsk,
  onRun,
  onCancel,
}: {
  member: StaffMember;
  isYou: boolean;
  busy: boolean;
  pending: Pending;
  onAsk: (pending: Pending) => void;
  onRun: (memberId: string, path: string, body?: object) => void;
  onCancel: () => void;
}) => {
  const asking = pending?.memberId === member.id ? pending.action : null;
  const run = (action: NonNullable<Pending>["action"]) =>
    action === "promote"
      ? onRun(member.id, "role", { role: "ADMIN" })
      : action === "demote"
        ? onRun(member.id, "role", { role: "DISPATCHER" })
        : onRun(member.id, action);

  return (
    <li className="space-y-3 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">
            {member.name}
            {isYou && <span className="font-normal text-muted"> (you)</span>}
          </p>
          <p className="break-all text-sm text-muted">{member.email}</p>
          <p className="mt-1 text-sm text-muted">
            {roleLabel[member.role]} ·{" "}
            {member.lastLoginAt
              ? `last signed in ${formatDateTime(member.lastLoginAt)}`
              : "never signed in"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {member.locked && (
            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
              Locked for 15 min
            </span>
          )}
          {member.pendingReset && (
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              Reset link sent
            </span>
          )}
        </div>
      </div>

      {!isYou && !asking && (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {member.isActive ? (
            <>
              <Button
                variant="link"
                disabled={busy}
                onClick={() =>
                  onAsk({
                    memberId: member.id,
                    action: member.role === "ADMIN" ? "demote" : "promote",
                  })
                }
              >
                {member.role === "ADMIN"
                  ? "Make dispatcher"
                  : "Make administrator"}
              </Button>
              <Button
                variant="link"
                disabled={busy}
                onClick={() =>
                  onAsk({ memberId: member.id, action: "reset-sign-in" })
                }
              >
                {member.locked ? "Unlock / reset sign-in" : "Reset sign-in"}
              </Button>
              <Button
                variant="link"
                disabled={busy}
                onClick={() =>
                  onAsk({ memberId: member.id, action: "deactivate" })
                }
              >
                Deactivate
              </Button>
            </>
          ) : (
            <Button
              variant="link"
              disabled={busy}
              onClick={() => onRun(member.id, "reactivate")}
            >
              Reactivate
            </Button>
          )}
        </div>
      )}

      {asking && (
        <div className="space-y-3 rounded-card border border-line bg-surface p-4">
          <p className="text-ink">{CONFIRM[asking](member.name)}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => run(asking)} disabled={busy}>
              {busy ? "Saving…" : "Yes, continue"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </li>
  );
};

// Administrators manage staff accounts: invite, change roles, deactivate,
// reset sign-ins. The API enforces every rule (admins only, nobody acts on
// their own account, always one active admin).
const StaffManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user: me, error: signInError } = useSignedIn<Staff>(
    "/staff/auth/me",
    "/admin/login",
  );
  const [overview, setOverview] = useState<StaffOverview>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending>(null);
  const [linkFor, setLinkFor] = useState<{
    result: StaffLinkResult;
    to: string;
  }>();
  const [inviteError, setInviteError] = useState<string>();

  const signIn = () =>
    router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);

  useEffect(() => {
    if (me?.role !== "ADMIN") return;
    let active = true;
    api<StaffOverview>("/staff/members").then((result) => {
      if (!active) return;
      if (result.ok) setOverview(result.data);
      else setError(result.message);
    });
    return () => {
      active = false;
    };
  }, [me]);

  // Runs an action; every one returns the updated lists.
  const post = async <T extends StaffOverview>(path: string, body?: object) => {
    setBusy(true);
    setError(undefined);
    const result = await api<T>(`/staff/${path}`, { method: "POST", body });
    setBusy(false);
    setPending(null);
    if (result.status === 401) {
      signIn();
      return null;
    }
    if (!result.ok) {
      setError(result.message);
      return null;
    }
    setOverview(result.data);
    return result.data;
  };

  const runMember = async (memberId: string, path: string, body?: object) => {
    setLinkFor(undefined);
    const member = overview?.members.find((m) => m.id === memberId);
    const result = await post<StaffOverview | StaffLinkResult>(
      `members/${memberId}/${path}`,
      body,
    );
    if (result && "link" in result && member) {
      setLinkFor({ result, to: member.email });
    }
  };

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const role = String(data.get("role") ?? "");
    setLinkFor(undefined);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setInviteError("Enter a valid email address.");
      return;
    }
    setInviteError(undefined);
    const result = await post<StaffLinkResult>("invites", { email, role });
    if (result) {
      setLinkFor({ result, to: email });
      form.reset();
    }
  };

  if (signInError) return <FormAlert>{signInError}</FormAlert>;
  if (!me) {
    return (
      <p role="status" className="text-muted">
        Loading…
      </p>
    );
  }

  const back = (
    <Link href="/admin" className="link-arrow">
      ← Dashboard
    </Link>
  );

  if (me.role !== "ADMIN") {
    return (
      <div className="space-y-6">
        {back}
        <FormAlert>Only administrators can manage staff.</FormAlert>
      </div>
    );
  }

  const active = overview?.members.filter((m) => m.isActive) ?? [];
  const inactive = overview?.members.filter((m) => !m.isActive) ?? [];
  const rowProps = {
    busy,
    pending,
    onAsk: (next: Pending) => {
      setPending(next);
      setLinkFor(undefined);
      setError(undefined);
    },
    onRun: (memberId: string, path: string, body?: object) =>
      void runMember(memberId, path, body),
    onCancel: () => setPending(null),
  };

  return (
    <div className="space-y-6">
      {back}
      <h1 className="section-title text-3xl">Staff</h1>

      {error && <FormAlert>{error}</FormAlert>}
      {linkFor && <LinkBox result={linkFor.result} to={linkFor.to} />}

      <section className="card p-6 sm:p-8" aria-label="Invite staff">
        <h2 className="card-title">Invite someone</h2>
        <p className="mt-2 text-muted">
          They get an email with a link to set their own password and connect
          their phone. Nobody else ever knows their sign-in.
        </p>
        <form
          onSubmit={invite}
          noValidate
          className="mt-4 grid gap-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end"
        >
          <Field name="email" label="Email" required error={inviteError}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              className="form-input"
              aria-invalid={!!inviteError}
              aria-describedby={describedBy("email", undefined, inviteError)}
            />
          </Field>
          <Field name="role" label="Role" required>
            <select
              id="role"
              name="role"
              defaultValue="DISPATCHER"
              className="form-input"
            >
              <option value="DISPATCHER">Dispatcher</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </Field>
          <Button type="submit" disabled={busy}>
            Send invite
          </Button>
        </form>
        <p className="mt-3 text-sm text-muted">
          Dispatchers manage rides. Administrators can also manage staff and
          waive fees.
        </p>
      </section>

      {!overview ? (
        <p role="status" className="text-muted">
          Loading staff…
        </p>
      ) : (
        <>
          <section className="card p-6 sm:p-8" aria-label="Staff">
            <h2 className="card-title">Staff ({active.length})</h2>
            <ul className="mt-2 divide-y divide-line">
              {active.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isYou={member.id === me.id}
                  {...rowProps}
                />
              ))}
            </ul>
          </section>

          {overview.invites.length > 0 && (
            <section className="card p-6 sm:p-8" aria-label="Pending links">
              <h2 className="card-title">Waiting to be used</h2>
              <ul className="mt-2 divide-y divide-line">
                {overview.invites.map((invite) => (
                  <li
                    key={invite.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="break-all font-semibold text-ink">
                        {invite.email}
                      </p>
                      <p className="text-sm text-muted">
                        {invite.kind === "reset"
                          ? "Sign-in reset"
                          : `Invited as ${roleLabel[invite.role].toLowerCase()}`}
                        {invite.invitedBy && ` by ${invite.invitedBy}`} ·
                        expires {formatDateTime(invite.expiresAt)}
                      </p>
                    </div>
                    <Button
                      variant="link"
                      disabled={busy}
                      onClick={() => void post(`invites/${invite.id}/revoke`)}
                    >
                      Cancel link
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {inactive.length > 0 && (
            <section className="card p-6 sm:p-8" aria-label="Deactivated staff">
              <h2 className="card-title">Deactivated ({inactive.length})</h2>
              <ul className="mt-2 divide-y divide-line">
                {inactive.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    isYou={false}
                    {...rowProps}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default StaffManagement;
