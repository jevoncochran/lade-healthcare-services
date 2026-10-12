import type { Metadata } from "next";
import AuthShell from "@/components/account/AuthShell";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a New Password",
};

// Opened from the link in the reset email: /reset-password?token=…
const ResetPassword = async ({ searchParams }: PageProps<"/reset-password">) => {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Choose a new password"
      intro="Changing your password signs you out on every other device."
    >
      <ResetPasswordForm token={typeof token === "string" ? token : ""} />
    </AuthShell>
  );
};

export default ResetPassword;
