"use client";

import { useEffect, useRef } from "react";
import { api } from "./api";

export const LIVE_UPDATE_MS = 10_000;

// Keeps a page up to date: every 10 seconds (while the tab is visible, and
// right away when you come back to it) it asks the API "has anything
// changed?" (`changesPath` returns a short version string) and calls
// `onChange` when the answer differs, so the page reloads its data.
//
// The check carries no patient information and doesn't count as activity on
// the API, so staff are still signed out after 15 idle minutes. When that
// happens the check gets a 401 and `onSignedOut` runs.
export const useLiveUpdates = (
  changesPath: string,
  onChange: () => void,
  onSignedOut?: () => void,
) => {
  // The latest callbacks, without restarting the timer on every render.
  const callbacks = useRef({ onChange, onSignedOut });
  useEffect(() => {
    callbacks.current = { onChange, onSignedOut };
  });

  useEffect(() => {
    let active = true;
    let version: string | undefined;

    const check = async () => {
      if (document.visibilityState !== "visible") return;
      const result = await api<{ version: string }>(changesPath);
      if (!active) return;
      if (result.ok) {
        if (version !== undefined && result.data.version !== version) {
          callbacks.current.onChange();
        }
        version = result.data.version;
      } else if (result.status === 401) {
        callbacks.current.onSignedOut?.();
      }
    };

    void check(); // the starting point
    const timer = setInterval(() => void check(), LIVE_UPDATE_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [changesPath]);
};
