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
      intro="For Lade staff only."
      footer={
        <p>
          Forgot your password or locked out? Ask an administrator to reset your
          sign-in.
        </p>
      }
    >
      <StaffLoginForm next={typeof next === "string" ? next : null} />
    </AuthShell>
  );
};

export default StaffLogin;
