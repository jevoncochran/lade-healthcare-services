// Frequently asked questions. Shared by the Services page and (later) Book a Ride.
// Cancellation answer matches the booking terms (/terms) and what the API
// charges. TODO (owner): the Medicaid / insurance booking and billing process.
export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 24 hours ahead for scheduled trips, and 48 hours if you can. For same-day rides or hospital discharges, call us any time and we'll get a vehicle to you as soon as one is available. Medicaid trips may need extra notice depending on your plan.",
  },
  {
    question: "Can a caregiver or family member ride along?",
    answer:
      "Yes. Caregivers and family members are welcome to ride with the passenger. Just let us know when you book so we can plan the right vehicle.",
  },
  {
    question:
      "What's the difference between door-to-door and door-through-door?",
    answer:
      "With door-to-door service, your driver meets you at the door of your home and walks you to the door of your destination. With door-through-door service, your driver also helps you inside, for example from your room to the vehicle, or all the way to the check-in desk.",
  },
  {
    question: "Do you offer wait-and-return trips?",
    answer:
      "Yes. Your driver can wait while you're at your appointment, or come back when you call to say you're ready.",
  },
  {
    question: "Are you really available 24/7?",
    answer:
      "Yes. We provide rides and customer service 24 hours a day, 7 days a week, including weekends, after hours and holidays.",
  },
  {
    question: "Do you go outside the Tampa Bay area?",
    answer:
      "Yes. We're based in Tampa and serve the Tampa Bay area every day, and we also provide long-distance trips across Florida and to other states, for example to a specialist or a hospital far from home. Long trips are priced individually: call us for a quote.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept Medicaid, private insurance, cash and cards. Booking online? You pay by card: it's saved when you book and charged after the ride. Using Medicaid or insurance? Call us to book, and we'll check your coverage before your ride.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "Cancel from My rides in your account, or call us. It's free until we confirm your ride, and up to 2 hours before a confirmed pickup. Cancelling less than 2 hours before pickup, or not being there when the driver arrives, costs a fee for card-paid rides; we show it before you cancel. Medicaid and insurance trips follow your plan's rules.",
  },
];
