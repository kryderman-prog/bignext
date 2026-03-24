import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "./LogoutButton";

interface Profile {
  id: string;
  name: string;
  [key: string]: any;
}

interface NavbarProps {
  user: User | null;
  profile: Profile | null;
}

export default function Navbar({ user, profile }: NavbarProps) {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="w-1/4">
          <Link href="/" className="font-bold text-lg">
            bigBlog
          </Link>
        </div>

        <div className="w-2/4 flex justify-center">
          {user && (
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full max-w-md border rounded px-3 py-2"
            />
          )}
        </div>

        <div className="w-1/4 flex justify-end space-x-4">
          {!user ? (
            <>
              <Link href="/signin">Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                Hello, {profile?.name || user.email}
              </span>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
