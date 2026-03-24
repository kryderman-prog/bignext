"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
      });

      console.log("signUp data:", data, "error:", error);

      if (error) {
        setErrorMsg(error.message || "Unable to sign up.");
        return;
      }

      if (!data.user) {
        setSuccessMsg("Sign-up created. Please verify your email before signing in.");
        setErrorMsg(null);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: form.name.trim(),
        role: "reader",
      });

      if (profileError) {
        console.error("profile insert error", profileError);
        setErrorMsg(profileError.message || "Could not create profile.");
        return;
      }

      setSuccessMsg("Account created successfully. Redirecting...");
      setTimeout(() => {
        router.push("/landing");
      }, 800);
    } catch (err) {
      console.error("Unexpected sign up error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

      {errorMsg && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</div>}
      {successMsg && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Join Blog"}
        </button>
      </form>
    </div>
  );
}
