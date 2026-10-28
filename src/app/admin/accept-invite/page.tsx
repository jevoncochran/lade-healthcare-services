import type { Metadata } from "next";
import AuthShell from "@/components/account/AuthShell";
import AcceptInvite from "./AcceptInvite";

export const generateMetadata = async ({
  searchParams,
}: PageProps<"/admin/accept-invite">): Promise<Metadata> => ({
  title:
    (await searchParams).reset === "1"
      ? "Reset Your Sign-In"
      : "Set Up Your Staff Account",
});

// Opened from an invite link (/admin/accept-invite?token=…) or a sign-in
// reset link (…&reset=1). `reset` only changes the wording; the token alone
// decides what the link can do.
const AcceptInvitePage = async ({
  searchParams,
}: PageProps<"/admin/accept-invite">) => {
  const { token, reset } = await searchParams;

  return (
    <AuthShell
      {...(reset === "1"
        ? {
            title: "Reset your sign-in",
            intro:
              "Two quick steps: connect your phone again, then choose a new password.",
          }
        : {
            title: "Set up your staff account",
            intro:
              "Three quick steps: connect your phone, add your name, and choose a password.",
          })}
    >
      <AcceptInvite token={typeof token === "string" ? token : ""} />
    </AuthShell>
  );
};

export default AcceptInvitePage;
