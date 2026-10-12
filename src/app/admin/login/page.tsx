import type { Metadata } from "next";
import AuthShell from "@/components/account/AuthShell";
import StaffLoginForm from "./StaffLoginForm";

export const metadata: Metadata = {
  title: "Staff Sign In",
};

const StaffLogin = async ({ searchParams }: PageProps<"/admin/login">) => {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="Staff sign in"
      intro="For Lade staff only. You'll need the code from your authenticator app."
      footer={
        <p>
          Locked out or lost your phone? Ask an administrator to send you a new
          invite.
        </p>
      }
    >
      <StaffLoginForm next={typeof next === "string" ? next : null} />
    </AuthShell>
  );
};

export default StaffLogin;
