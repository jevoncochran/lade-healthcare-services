import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// Site font. To change it, swap the import here; globals.css reads the
// --font-body-face variable, so nothing else needs to change.
const publicSans = Public_Sans({
  variable: "--font-body-face",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lade Health Care Services | Non-Emergency Medical Transportation",
    template: "%s | Lade Health Care Services",
  },
  description:
    "Safe, reliable non-emergency medical transportation — ambulatory, wheelchair and stretcher transport, hospital visits and discharges. Available 24/7, including weekends and holidays. Medicaid, private insurance and cash accepted.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en" className={`${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
