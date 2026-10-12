import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/account/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

// /login?next=/account sends people back where they were going.
const Login = async ({ searchParams }: PageProps<"/login">) => {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="Sign in"
      intro="Sign in to book and manage rides."
      footer={
        <p>
          New here?{" "}
          <Link href="/signup" className="font-semibold text-secondary hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm next={typeof next === "string" ? next : null} />
    </AuthShell>
  );
};

export default Login;
