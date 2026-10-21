import type { Metadata } from "next";
import AuthShell from "@/components/account/AuthShell";
import AcceptInvite from "./AcceptInvite";

export const metadata: Metadata = {
  title: "Set Up Your Staff Account",
};

// Opened from an invite link: /admin/accept-invite?token=…
const AcceptInvitePage = async ({
  searchParams,
}: PageProps<"/admin/accept-invite">) => {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Set up your staff account"
      intro="Three quick steps: connect your phone, add your name, and choose a password."
    >
      <AcceptInvite token={typeof token === "string" ? token : ""} />
    </AuthShell>
  );
};

export default AcceptInvitePage;
