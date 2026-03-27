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
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 lg:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="font-bold text-lg whitespace-nowrap">
              bigBlog
            </Link>

            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 md:hidden">
              {!user ? (
                <>
                  <Link href="/signin" className="whitespace-nowrap">
                    Sign In
                  </Link>
                  <Link href="/signup" className="whitespace-nowrap">
                    Sign Up
                  </Link>
                  <Link href="/landing" className="whitespace-nowrap">
                    View Blogs
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium max-w-[10rem] truncate sm:max-w-[12rem]">
                    Hello, {profile?.name || user.email}
                  </span>
                  <Link href="/write-blog" className="whitespace-nowrap">
                    Write Blog
                  </Link>
                  <Link href="/landing" className="whitespace-nowrap">
                    view blogs
                  </Link>
                  <LogoutButton />
                </>
              )}
            </div>
          </div>

          {user && (
            <div className="w-full md:flex-1 md:min-w-0 md:flex md:justify-center">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full md:max-w-md border rounded px-3 py-2"
              />
            </div>
          )}

          <div className="hidden md:flex items-center justify-end gap-4 whitespace-nowrap">
            {!user ? (
              <>
                <Link href="/signin">Sign In</Link>
                <Link href="/signup">Sign Up</Link>
                <Link href="/landing">View Blogs</Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium max-w-[12rem] truncate lg:max-w-[14rem]">
                  Hello, {profile?.name || user.email}
                </span>
                <Link href="/write-blog">Write Blog</Link>
                <Link href="/landing">view blogs</Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
