import type { Metadata } from "next";
import RideDetail from "./RideDetail";

export const metadata: Metadata = {
  title: "Your Ride",
};

// /my-rides/<booking id>
const RidePage = async ({ params }: PageProps<"/my-rides/[id]">) => {
  const { id } = await params;
  return (
    <section className="section section-alt">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <RideDetail id={id} />
        </div>
      </div>
    </section>
  );
};

export default RidePage;
