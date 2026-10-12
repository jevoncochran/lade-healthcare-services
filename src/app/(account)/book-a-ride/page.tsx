import type { Metadata } from "next";
import BookRide from "./BookRide";

export const metadata: Metadata = {
  title: "Book a Ride",
};

// Booking needs an account: signed-out visitors are sent to sign in and come
// back here afterwards (same as My Account).
const BookARide = () => {
  return (
    <section className="section section-alt">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <BookRide />
        </div>
      </div>
    </section>
  );
};

export default BookARide;
