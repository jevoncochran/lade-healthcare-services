import type { Metadata } from "next";
import MyRides from "./MyRides";

export const metadata: Metadata = {
  title: "My Rides",
};

const MyRidesPage = () => {
  return (
    <section className="section section-alt">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <MyRides />
        </div>
      </div>
    </section>
  );
};

export default MyRidesPage;
