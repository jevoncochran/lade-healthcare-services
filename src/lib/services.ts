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

// Full service list for the Services page. `id` is the section anchor
// (e.g. /services#hospital-discharge). Add `image` + `imageAlt` once the
// client supplies a photo for a service; until then an icon panel is shown.
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

export const services: Service[] = [
  {
    id: "medical-appointments",
    icon: HospitalIcon,
    title: "Non-Emergency Medical Transportation",
    paragraphs: [
      "When an appointment matters but isn't an emergency, you need a ride you can count on. We take patients to doctor's offices, specialists, physical therapy, imaging, outpatient procedures and follow-up visits, then bring them home again.",
      "Rather not be dropped off and picked up later? Book a wait-and-return trip. Your driver can wait during your appointment or come back as soon as you call.",
    ],
    highlights: [
      "Doctor and specialist appointments",
      "Therapy, imaging and outpatient procedures",
      "Wait-and-return trips available",
    ],
  },
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
  },
  {
    id: "dialysis-recurring",
    icon: RepeatIcon,
    title: "Dialysis & Recurring Rides",
    paragraphs: [
      "Dialysis, chemotherapy, physical therapy and other ongoing treatments don't leave room for a missed ride. Set up a standing schedule once and we'll be there for every session, without you having to call each week.",
      "Facilities and case managers can set up recurring rides for their patients and residents too.",
    ],
    highlights: [
      "One standing schedule, every session",
      "Dialysis, chemotherapy and therapy",
      "Easy changes when your schedule does",
    ],
  },
  {
    id: "private-transport",
    icon: HeartHandIcon,
    title: "Private Accessible Transportation",
    paragraphs: [
      "Not every trip is medical. We also take seniors and riders with disabilities to family gatherings, weddings, church, shopping and everyday errands in an accessible vehicle, with a driver who's there to help.",
      "Book a one-way ride, a round trip or a wait-and-return trip, any day of the week.",
    ],
    highlights: [
      "Family events, errands and outings",
      "Accessible vehicles for every rider",
      "One-way, round trip or wait-and-return",
    ],
  },
  {
    id: "long-distance",
    icon: VanIcon,
    action: "call",
    title: "Long-Distance & Out-of-State Trips",
    paragraphs: [
      "Heading to a specialist in Gainesville, Orlando or Jacksonville, or to another state? We provide long-distance medical transportation from the Tampa Bay area across Florida and beyond, with the same trained drivers and accessible vehicles.",
      "Long trips are priced individually, so call us for a quote. We'll plan the route, any stops along the way and the ride home.",
    ],
    highlights: [
      "Across Florida and out of state",
      "Wheelchair and stretcher trips",
      "Call for a quote",
    ],
  },
];
