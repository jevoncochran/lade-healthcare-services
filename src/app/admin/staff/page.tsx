import type { Metadata } from "next";
import StaffManagement from "./StaffManagement";

export const metadata: Metadata = {
  title: "Staff",
};

// /admin/staff — administrators only (the API enforces it too).
const StaffPage = () => {
  return (
    <section className="section section-alt">
      <div className="container-site">
        <StaffManagement />
      </div>
    </section>
  );
};

export default StaffPage;
