"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LEFT — Logo */}
        <div className="w-1/4">
          <Link href="/" className="font-bold text-lg">
            BigNext
          </Link>
        </div>

        {/* CENTER — Search (only if logged in) */}
        <div className="w-2/4 flex justify-center">
          {isLoggedIn && (
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full max-w-md border rounded px-3 py-2"
            />
          )}
        </div>

        {/* RIGHT — Actions */}
        <div className="w-1/4 flex justify-end space-x-4">

          {!isLoggedIn ? (
            <>
              <Link href="/signin" onClick={handleLogin}>
                Sign In
              </Link>
              <Link href="/signup">
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout}>
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}