"use client";
 
import { logout } from "@/app/actions/logout";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-sm">
        Logout
      </button>
    </form>
  );
}
