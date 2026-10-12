import type { Metadata } from "next";
import StaffHome from "./StaffHome";

export const metadata: Metadata = {
  // The "%s | Lade Staff" template in admin/layout.tsx only applies to pages
  // below /admin, not /admin itself.
  title: { absolute: "Dashboard | Lade Staff" },
};

const Admin = () => {
  return (
    <section className="section section-alt">
      <div className="container-site">
        <StaffHome />
      </div>
    </section>
  );
};

export default Admin;
