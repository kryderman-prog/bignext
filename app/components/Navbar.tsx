"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return;
      }
      setSession(null);
      router.push("/signin");
    } catch (err) {
      console.error("Unexpected logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="w-1/4">
          <Link href="/" className="font-bold text-lg">
            bigBlog
          </Link>
        </div>

        <div className="w-2/4 flex justify-center">
          {session && (
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full max-w-md border rounded px-3 py-2"
            />
          )}
        </div>

        <div className="w-1/4 flex justify-end space-x-4">
          {!session ? (
            <>
              <Link href="/signin">Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} disabled={loading} className="text-sm">
              {loading ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
