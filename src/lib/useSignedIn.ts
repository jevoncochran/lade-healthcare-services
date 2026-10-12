"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "./api";

// Loads the signed-in person from the API (`/auth/me` for customers,
// `/staff/auth/me` for staff). If nobody is signed in, or the session has
// timed out, sends them to the sign-in page and back here afterwards.
//
// The session cookie belongs to the API, so the website can only find out
// who is signed in by asking it from the browser.
export const useSignedIn = <T>(mePath: string, loginPath: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<T | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    api<T>(mePath).then((result) => {
      if (!active) return;
      if (result.ok) {
        setUser(result.data);
        // Arriving from a long form can leave the page scrolled down.
        window.scrollTo({ top: 0 });
      } else if (result.status === 401) {
        router.replace(`${loginPath}?next=${encodeURIComponent(pathname)}`);
      } else {
        setError(result.message);
      }
    });
    return () => {
      active = false;
    };
  }, [mePath, loginPath, pathname, router]);

  return { user, error };
};
