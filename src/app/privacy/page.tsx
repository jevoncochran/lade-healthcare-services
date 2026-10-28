import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Lade Health Care Services collects, uses and protects your information when you book rides.",
};

// DRAFT written from what the system actually collects and who processes it
// (lade-hcs-server: prisma/schema.prisma, docs/plan.md → HIPAA approach).
// Keep it in step with the code: a new data field or vendor means updating
// this page. Lade must approve it and an attorney should review it before
// launch, including whether Lade also needs a HIPAA Notice of Privacy
// Practices.
const PrivacyPage = () => (
  <LegalPage title="Privacy Notice" updated="October 28, 2026" draft>
    <p>
      <Placeholder>Lade Health Care Services, LLC</Placeholder>{" "}
      (&ldquo;Lade&rdquo;, &ldquo;we&rdquo;) provides non-emergency medical
      transportation. Because rides go to medical appointments, we treat the
      details of every ride as health information and protect it to the
      standards of HIPAA, the federal health privacy law. This notice explains
      what we collect on ladehcs.com, why, who we share it with, and your
      choices.{" "}
      <Placeholder>
        Attorney to review: whether Lade also needs a HIPAA Notice of Privacy
        Practices
      </Placeholder>
    </p>

    <h2>What we collect</h2>
    <h3>Your account</h3>
    <ul>
      <li>Your first and last name, email address and phone number.</li>
      <li>
        Your password, stored only in a scrambled form (a hash) that even we
        can&apos;t read.
      </li>
      <li>When you accepted these terms and our privacy notice.</li>
    </ul>
    <h3>Your rides</h3>
    <ul>
      <li>
        The rider&apos;s name and phone number, and your relationship to them if
        you book for someone else.
      </li>
      <li>
        Pickup and drop-off addresses, pickup and appointment times, and the
        type of trip.
      </li>
      <li>
        The care level (walking, wheelchair, stretcher), mobility needs,
        companions and instructions for the driver.
      </li>
      <li>
        What happened on the ride (completed, waiting time, cancelled or
        no-show) and what it cost.
      </li>
    </ul>
    <h3>Payment</h3>
    <p>
      Your card details go directly to our payment processor, Stripe. We never
      see or store your full card number. We keep Stripe&apos;s reference
      numbers so we can charge your saved card after the ride.
    </p>
    <h3>Security records</h3>
    <p>
      When you sign in or use your account, we record the time, your IP address
      and browser type, to protect your account and to keep the access records
      health privacy rules require.
    </p>
    <h3>What we don&apos;t collect</h3>
    <p>
      We don&apos;t ask for your date of birth, Social Security number,
      diagnosis or insurance details online. We don&apos;t use advertising or
      tracking cookies, and we don&apos;t sell or rent your information to
      anyone.
    </p>

    <h2>How we use it</h2>
    <ul>
      <li>To arrange, carry out and charge for your rides.</li>
      <li>
        To work out the distance and price of a trip, and to suggest addresses
        as you type.
      </li>
      <li>
        To email you about your account and rides: confirmations, cancellations,
        receipts and payment problems. These emails include your booking
        reference but never the rider&apos;s name, addresses or medical details.
      </li>
      <li>To keep your account and our systems secure.</li>
      <li>To meet our legal and record-keeping obligations.</li>
    </ul>

    <h2>Who we share it with</h2>
    <p>
      Only the companies that help us run the service, and only what each one
      needs. Those that handle ride or health information have signed a Business
      Associate Agreement with us, the contract HIPAA requires.
    </p>
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>What they do for us</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Google Cloud</td>
          <td>Hosts our website and database (BAA in place)</td>
        </tr>
        <tr>
          <td>Amazon Web Services</td>
          <td>
            Address suggestions and driving distances; sending our emails (BAA
            in place)
          </td>
        </tr>
        <tr>
          <td>Google Workspace</td>
          <td>Our email inbox, if you write to us (BAA in place)</td>
        </tr>
        <tr>
          <td>Stripe</td>
          <td>
            Card payments. Stripe receives your email address and card, but no
            ride, address or health information.
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      We may also share information when the law requires it, for example in
      response to a court order, or to protect someone&apos;s safety in an
      emergency.
    </p>

    <h2>How we protect it</h2>
    <ul>
      <li>
        Names, contact details, addresses and ride notes are encrypted in our
        database, and all traffic to our site is encrypted (HTTPS).
      </li>
      <li>
        Only Lade staff who need it can see ride information. Staff sign in with
        a password and a code from their phone, are signed out after 15 minutes
        without activity, and every time they view or change a booking is
        recorded.
      </li>
      <li>
        Your sign-in uses a secure cookie that only our site can read. On the
        payment step, Stripe&apos;s card form sets its own cookies to prevent
        fraud. We use no advertising or tracking cookies.
      </li>
    </ul>

    <h2>How long we keep it</h2>
    <p>
      <Placeholder>
        Retention period to be decided by Lade (HIPAA records: at least 6 years;
        check Florida requirements)
      </Placeholder>
    </p>

    <h2>Your choices</h2>
    <ul>
      <li>
        You can see your details and rides in{" "}
        <Link href="/account">My Account</Link> at any time.
      </li>
      <li>
        To correct your information, get a copy of it, or close your account,
        contact us. We may need to keep some records for the period the law
        requires, even after you close your account.
      </li>
      <li>
        Accounts are for adults (18+). A parent, guardian or caregiver can book
        rides for a child.
      </li>
    </ul>

    <h2>Changes to this notice</h2>
    <p>
      If we change how we handle your information, we&apos;ll update this page
      and the date above, and let you know before your next booking if the
      change is significant.
    </p>

    <h2>Contact us</h2>
    <p>
      Questions or requests about your information:
      <br />
      <Placeholder>Lade Health Care Services, LLC</Placeholder>
      <br />
      {site.address}
      <br />
      Phone: {site.phone}
      <br />
      Email: <a href={`mailto:${site.email}`}>{site.email}</a>
    </p>
    <p>
      See also our <Link href="/terms">Terms of Service</Link>.
    </p>
  </LegalPage>
);

export default PrivacyPage;
