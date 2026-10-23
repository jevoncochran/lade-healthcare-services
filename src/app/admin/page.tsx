import type { Metadata } from "next";
import { parseRideFilters } from "@/lib/staff";
import StaffHome from "./StaffHome";

export const metadata: Metadata = {
  // The "%s | Lade Staff" template in admin/layout.tsx only applies to pages
  // below /admin, not /admin itself.
  title: { absolute: "Dashboard | Lade Staff" },
};

// /admin?status=…&from=…: the ride list filters live in the URL.
const Admin = async ({ searchParams }: PageProps<"/admin">) => {
  const filters = parseRideFilters(await searchParams);

  return (
    <section className="section section-alt">
      <div className="container-site">
        <StaffHome filters={filters} />
      </div>
    </section>
  );
};

export default Admin;
