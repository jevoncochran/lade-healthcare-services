"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import { api, type Staff } from "@/lib/api";
import { useSignedIn } from "@/lib/useSignedIn";

// Placeholder staff home. Ride management screens come with phase 3.
const StaffHome = () => {
  const router = useRouter();
  const { user: staff, error } = useSignedIn<Staff>(
    "/staff/auth/me",
    "/admin/login",
  );
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await api("/staff/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (error) return <FormAlert>{error}</FormAlert>;

  if (!staff) {
    return (
      <p role="status" className="text-muted">
        Loading…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title text-3xl">Staff dashboard</h1>
          <p className="mt-2 text-muted">
            Signed in as {staff.name} ·{" "}
            {staff.role === "ADMIN" ? "Administrator" : "Dispatcher"}
          </p>
        </div>
        <Button variant="outline" onClick={signOut} disabled={signingOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="card-title">Rides</h2>
        <p className="mt-3 text-muted">
          Ride requests will show up here once online booking is live.
        </p>
      </div>

      <p className="text-sm text-muted">
        For patient privacy, you&apos;re signed out automatically after 15
        minutes without activity.
      </p>
    </div>
  );
};

export default StaffHome;
