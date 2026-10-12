import type { Metadata } from "next";
import AuthShell from "@/components/account/AuthShell";
import VerifyEmail from "./VerifyEmail";

export const metadata: Metadata = {
  title: "Confirm Your Email",
};

// Opened from the link in the sign-up email: /verify-email?token=…
const VerifyEmailPage = async ({ searchParams }: PageProps<"/verify-email">) => {
  const { token } = await searchParams;

  return (
    <AuthShell title="Confirm your email">
      <VerifyEmail token={typeof token === "string" ? token : ""} />
    </AuthShell>
  );
};

export default VerifyEmailPage;
