"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIsLoggedIn } from "@/lib/auth";

/**
 * Returns `true` while the user is NOT logged in (access blocked).
 * Fires a redirect to /signup and renders nothing until auth is confirmed.
 */
export function useAuthGuard(next: string): boolean {
  const router = useRouter();
  const [blocked, setBlocked] = useState(true); // assume blocked until we check

  useEffect(() => {
    if (getIsLoggedIn()) {
      setBlocked(false);
    } else {
      router.replace(`/signup?next=${encodeURIComponent(next)}`);
    }
  }, []);

  return blocked;
}
