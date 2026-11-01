// Service content shared by the home page and the Services page.
import {
  DischargeIcon,
  HeartHandIcon,
  HospitalIcon,
  HourglassIcon,
  RepeatIcon,
  StretcherIcon,
  VanIcon,
  WalkIcon,
  WheelchairIcon,
  type IconComponent,
} from "@/components/Icons";

export type ServiceItem = {
  icon: IconComponent;
  title: string;
  description: string;
};

export const careLevels: ServiceItem[] = [
  {
    icon: WalkIcon,
    title: "Ambulatory",
    description:
      "For riders who can walk on their own or with a little help. Our drivers assist with getting in and out of the vehicle safely.",
  },
  {
    icon: WheelchairIcon,
    title: "Wheelchair",
    description:
      "Ramp- and lift-equipped vehicles with secure wheelchair restraints, so riders can stay seated for the entire trip.",
  },
  {
    icon: StretcherIcon,
    title: "Stretcher",
    description:
      "For riders who need to lie flat. Two trained attendants and a secured stretcher for comfortable, safe transport.",
  },
];

export const tripTypes: ServiceItem[] = [
  {
    icon: HospitalIcon,
    title: "Hospital & Doctor Visits",
    description: "Appointments, procedures, therapy and follow-ups.",
  },
  {
    icon: DischargeIcon,
    title: "Hospital Discharge",
    description: "Safe rides home from the hospital, day or night.",
  },
  {
    icon: RepeatIcon,
    title: "Dialysis & Recurring Trips",
    description: "Set it once — we'll be there every scheduled visit.",
  },
  {
    icon: HeartHandIcon,
    title: "Private Disabled Transport",
    description: "Accessible rides for errands, events and family visits.",
  },
  {
    icon: HourglassIcon,
    title: "Wait & Return Trips",
    description: "We wait during your appointment or return when you call.",
  },
];

export const audiences = [
  {
    title: "Seniors",
    description:
      "Reliable rides that help older adults stay independent and keep every appointment.",
  },
  {
    title: "People with Disabilities",
    description:
      "Accessible vehicles and patient, trained drivers for every mobility need.",
  },
  {
    title: "Dialysis Patients",
    description:
      "Dependable recurring transportation that runs on your treatment schedule.",
  },
  {
    title: "Post-Surgery Patients",
    description:
      "Gentle, careful transport when you can't (or shouldn't) drive yourself.",
  },
  {
    title: "Facilities",
    description:
      "Hospitals, nursing homes and assisted living communities can schedule rides for residents and patients.",
  },
];

export const paymentOptions = [
  "Medicaid",
  "Private Insurance",
  "Cash / Private Pay",
];

// Services on the Services page. `id` is the section anchor (e.g.
// /services#hospital-discharge). Non-emergency medical transportation isn't
// one of them: it's what they all are, so the page introduces it above the
// list. Featured services get a full row with a photo (`image` + `imageAlt`).
// Details confirmed by Jevon for launch (2026-10-28).
export type Service = {
  id: string;
  icon: IconComponent;
  title: string;
  paragraphs: string[];
  highlights: string[];
  image?: string;
  imageAlt?: string;
  // "call": a phone button instead of "Book a Ride", for trips online
  // booking doesn't take (e.g. long distance: call for a quote).
  action?: "book" | "call";
};

export const featuredServices: Service[] = [
  {
    id: "hospital-discharge",
    icon: DischargeIcon,
    title: "Hospital Discharge",
    paragraphs: [
      "Leaving the hospital rarely happens on schedule. A final check from the doctor, paperwork and prescriptions can push your discharge back by hours. Book your ride ahead for an approximate time, or call us when you're ready. We run 24 hours a day, so a late-night discharge isn't a problem.",
      "Your driver can meet you in your room or the lobby and, with door-through-door service, help you all the way inside when you get home. A family member or caregiver is welcome to ride along.",
    ],
    highlights: [
      "Book ahead or call when you're ready",
      "Day or night, including holidays",
      "Help from your room to your front door",
    ],
    image: "/assets/images/services/hospital_discharge.jpg",
    imageAlt:
      "A smiling older woman in a hospital gown hugging a nurse beside her hospital bed",
  },
  {
    id: "wheelchair",
    icon: WheelchairIcon,
    title: "Wheelchair Transportation",
    paragraphs: [
      "Our wheelchair-accessible vehicles have ramps or lifts, so riders stay in their own wheelchair from pickup to drop-off. Every chair is secured before the vehicle moves.",
      "New to using a wheelchair? Your driver will show you how the ramp and securement work so you feel comfortable on the ride.",
    ],
    highlights: [
      "Ramp or lift entry",
      "Stay seated in your own wheelchair",
      "Manual and power wheelchairs",
    ],
    image: "/assets/images/services/wheelchair_transport.jpg",
    imageAlt:
      "A helper pushing a person in a wheelchair up the ramp into the back of an accessible van",
  },
  {
    id: "stretcher",
    icon: StretcherIcon,
    title: "Stretcher Transportation",
    paragraphs: [
      "For riders who can't sit upright, whether they're recovering from surgery, confined to bed or too weak for a wheelchair. A two-person crew moves the rider safely from bed to stretcher and keeps them comfortable on the way.",
      "Stretcher transportation is for patients who are medically stable. If someone needs medical monitoring during the trip, call 911 or an ambulance service.",
    ],
    highlights: [
      "Two-person crew",
      "Bed-to-stretcher transfers",
      "For medically stable patients",
    ],
    image: "/assets/images/services/stretcher_transportation.jpg",
    imageAlt:
      "Two attendants loading an older patient lying on a stretcher into the back of a transport van",
  },
  {
    id: "ambulatory",
    icon: WalkIcon,
    title: "Ambulatory Transportation",
    paragraphs: [
      "For riders who can walk but shouldn't drive, or who just need a steady hand. Your driver helps you in and out of the vehicle and can walk with you to the door, or all the way inside.",
      "Walkers, canes and folding wheelchairs are welcome on board.",
    ],
    highlights: [
      "Help in and out of the vehicle",
      "Walkers and canes welcome",
      "Door-to-door or door-through-door",
    ],
    image: "/assets/images/services/ambulatory_transportation.jpg",
    imageAlt:
      "A caregiver holding an older woman's hands to help her step out of a car",
  },
];

// Shown three across as compact cards, so each has one short paragraph.
export const moreServices: Service[] = [
  {
    id: "dialysis-recurring",
    icon: RepeatIcon,
    title: "Dialysis & Recurring Rides",
    paragraphs: [
      "Set up a standing schedule once and we'll be there for every session, without a call each week. Facilities can schedule rides for their patients too.",
    ],
    highlights: [
      "Dialysis, chemotherapy and therapy",
      "Easy changes when your schedule does",
    ],
  },
  {
    id: "private-transport",
    icon: HeartHandIcon,
    title: "Private Accessible Transportation",
    paragraphs: [
      "Not every trip is medical. Accessible rides to family events, church, shopping and errands, with a driver who's there to help.",
    ],
    highlights: [
      "Seniors and riders with disabilities",
      "One-way, round trip or wait-and-return",
    ],
  },
  {
    id: "long-distance",
    icon: VanIcon,
    action: "call",
    title: "Long-Distance & Out-of-State Trips",
    paragraphs: [
      "Specialists in Gainesville, Orlando or Jacksonville, or another state: we drive from Tampa Bay across Florida and beyond. Long trips are priced individually.",
    ],
    highlights: ["Wheelchair and stretcher trips", "Call us for a quote"],
  },
];

// Every service, in page order (footer links, the Services page's jump links).
export const services: Service[] = [...featuredServices, ...moreServices];
