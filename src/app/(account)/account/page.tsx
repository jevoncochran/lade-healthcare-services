import type { Metadata } from "next";
import AccountDetails from "./AccountDetails";

export const metadata: Metadata = {
  title: "My Account",
};

const Account = () => {
  return (
    <section className="section section-alt">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <AccountDetails />
        </div>
      </div>
    </section>
  );
};

export default Account;
