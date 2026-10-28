import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for booking rides with Lade Health Care Services: booking, prices, waiting time, cancellations and no-shows.",
};

// DRAFT written from how the booking system actually works (docs/plan.md in
// lade-hcs-server). Every fee and time limit here is enforced by the API:
// change them together. Lade must approve this text and an attorney should
// review it before launch; then remove `draft`, set the date, and bump
// TERMS_VERSION on the API so customers' consent is recorded against the
// new version.
const TermsPage = () => (
  <LegalPage title="Terms of Service" updated="October 28, 2026" draft>
    <p>
      These terms apply when you create an account on ladehcs.com or book a ride
      with <Placeholder>Lade Health Care Services, LLC</Placeholder>{" "}
      (&ldquo;Lade&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an
      account or booking a ride, you agree to them. Our{" "}
      <Link href="/privacy">Privacy Notice</Link> explains how we handle your
      information.
    </p>

    <h2>1. Our service</h2>
    <p>
      We provide non-emergency medical transportation in Florida: rides to and
      from medical appointments, hospital discharges, dialysis and other care,
      for people who walk, use a wheelchair or need a stretcher.
    </p>
    <p>
      <strong>
        We are not an ambulance or emergency service. In an emergency, call 911.
      </strong>{" "}
      Our drivers are not medical providers and do not give medical care.
    </p>

    <h2>2. Your account</h2>
    <ul>
      <li>You must be at least 18 to create an account and book rides.</li>
      <li>
        You can book for yourself or for someone else, such as a family member,
        a patient or a resident you care for. When you book for someone else,
        you confirm you&apos;re allowed to share their information with us and
        to arrange the ride for them.
      </li>
      <li>
        Keep your information accurate and your password private. You&apos;re
        responsible for bookings made through your account.
      </li>
    </ul>

    <h2>3. Booking</h2>
    <ul>
      <li>
        Book at least <strong>24 hours</strong> before pickup. For sooner rides,
        call us at {site.phone}.
      </li>
      <li>
        Online booking covers trips within Florida where each leg is 50 miles or
        less. For longer or out-of-state trips, call us for a quote.
      </li>
      <li>
        A booking is a request until we confirm it. We&apos;ll email you when
        it&apos;s confirmed. We may decline a request, for example if no
        suitable vehicle is available; you aren&apos;t charged for a declined
        request.
      </li>
      <li>
        Tell us about mobility needs (wheelchair type, help on stairs,
        stretcher), companions and anything the driver should know, so we can
        send the right vehicle and crew. We may be unable to complete a ride if
        the information was inaccurate.
      </li>
    </ul>

    <h2>4. Prices</h2>
    <p>
      The price shown before you book is a base fare plus mileage for the care
      level and trip type you choose. Mileage is the driving distance, rounded
      up to the next tenth of a mile. A round trip, or a trip where the driver
      waits and brings you back, uses the round-trip base fare and the miles of
      both legs.
    </p>
    <p>
      Companions ride free. We don&apos;t charge extra at night, on weekends or
      on holidays.
    </p>

    <h3>Waiting time</h3>
    <p>
      The first 15 minutes of waiting at a pickup are free. After that, waiting
      time costs <strong>$15 for each 15 minutes</strong> or part of 15 minutes.
      For a wait-and-return trip, the time the driver waits during the
      appointment counts the same way. Waiting time is added after the ride.
    </p>

    <h3>Current fees by care level</h3>
    <p>
      <Placeholder>Pending Lade&apos;s approval</Placeholder>
    </p>
    <table>
      <thead>
        <tr>
          <th>Care level</th>
          <th>No-show fee</th>
          <th>Late cancellation fee</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ambulatory</td>
          <td>$50.00</td>
          <td>$25.00</td>
        </tr>
        <tr>
          <td>Wheelchair</td>
          <td>$75.00</td>
          <td>$37.50</td>
        </tr>
        <tr>
          <td>Bariatric wheelchair</td>
          <td>$125.00</td>
          <td>$62.50</td>
        </tr>
        <tr>
          <td>Stretcher</td>
          <td>$175.00</td>
          <td>$87.50</td>
        </tr>
      </tbody>
    </table>

    <h2>5. Payment</h2>
    <ul>
      <li>
        When you book, we save your card with our payment processor, Stripe.
        Your card is <strong>not charged at booking</strong>. We never see or
        store your full card number.
      </li>
      <li>
        <strong>
          By booking, you authorize us to charge your saved card after the ride
        </strong>{" "}
        for the ride and any waiting time, or for a no-show or late cancellation
        fee as described below. We email you a receipt.
      </li>
      <li>
        If a charge doesn&apos;t go through, we&apos;ll contact you to arrange
        payment.
      </li>
      <li>
        Questions about a charge? Contact us at {site.email} or {site.phone}. If
        we made a mistake, we&apos;ll refund it.
      </li>
    </ul>

    <h2>6. Cancelling</h2>
    <ul>
      <li>
        You can cancel a ride from your account (My rides) until the pickup
        time. After the pickup time, call us.
      </li>
      <li>
        Cancelling is <strong>free</strong> until we confirm the ride, and until{" "}
        <strong>2 hours before a confirmed pickup</strong>.
      </li>
      <li>
        Cancelling a confirmed ride less than 2 hours before pickup costs the{" "}
        <strong>late cancellation fee</strong> for its care level (see the table
        above). We show the fee and ask you to confirm before cancelling.
      </li>
      <li>If we cancel a ride, you aren&apos;t charged.</li>
    </ul>

    <h2>7. No-shows</h2>
    <p>
      Please be ready at the pickup time. If the rider isn&apos;t at the pickup
      15 minutes after the pickup time and we can&apos;t reach you, the ride is
      recorded as a no-show and the <strong>no-show fee</strong> for its care
      level is charged. Any ride back is cancelled at no charge. If you think a
      no-show was recorded in error, contact us.
    </p>

    <h2>8. Safety and conduct</h2>
    <ul>
      <li>
        Riders must wear a seat belt or be secured as our driver directs.
        Wheelchairs must be in safe working order.
      </li>
      <li>
        Our driver may refuse or end a ride if it can&apos;t be done safely, or
        if a rider or companion is abusive, threatening or under the influence
        in a way that puts anyone at risk.
      </li>
      <li>
        Don&apos;t bring weapons, illegal substances, or anything hazardous.
      </li>
    </ul>

    <h2>9. Our responsibility</h2>
    <p>
      We work hard to be on time, but traffic, weather and other things outside
      our control can cause delays, and we aren&apos;t responsible for missed
      appointments or other losses caused by them. Please allow extra time for
      important appointments.{" "}
      <Placeholder>
        Attorney to review: limitation of liability, insurance, claims process
      </Placeholder>
    </p>

    <h2>10. Changes to these terms</h2>
    <p>
      We may update these terms. The version you accepted when booking applies
      to that booking. If we make significant changes, we&apos;ll update the
      date above and ask you to accept the new terms before your next booking.
    </p>

    <h2>11. Governing law</h2>
    <p>
      These terms are governed by the laws of the State of Florida.{" "}
      <Placeholder>
        Attorney to review: venue and dispute resolution
      </Placeholder>
    </p>

    <h2>12. Contact us</h2>
    <p>
      <Placeholder>Lade Health Care Services, LLC</Placeholder>
      <br />
      {site.address}
      <br />
      Phone: {site.phone}
      <br />
      Email: <a href={`mailto:${site.email}`}>{site.email}</a>
    </p>
  </LegalPage>
);

export default TermsPage;
