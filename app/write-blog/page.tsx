"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function WriteBlogPage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    // 2. Insert blog
    const { error: insertError } = await supabase.from("blogs").insert({
      user_id: user.id,
      title: form.title,
      content: form.content,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // 3. Redirect
    router.push("/landing");
    router.refresh()
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Write Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Content"
          className="w-full border p-2 h-40"
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}