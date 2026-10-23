import type { Metadata } from "next";
import { safeListHref } from "@/lib/staff";
import BookingDetail from "./BookingDetail";

// No rider name or reference in the title: tab titles end up in browser
// history and on shared screens.
export const metadata: Metadata = {
  title: "Booking",
};

// /admin/bookings/<id>?back=<the ride list URL it was opened from>
const BookingPage = async ({
  params,
  searchParams,
}: PageProps<"/admin/bookings/[id]">) => {
  const { id } = await params;
  const { back } = await searchParams;

  return (
    <section className="section section-alt">
      <div className="container-site">
        <BookingDetail
          id={id}
          listHref={safeListHref(typeof back === "string" ? back : undefined)}
        />
      </div>
    </section>
  );
};

export default BookingPage;
