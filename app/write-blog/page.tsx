"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function WriteBlogPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const blogId = searchParams.get("id");
  const isEdit = !!blogId;

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch blog if edit mode
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, content, user_id")
        .eq("id", blogId)
        .single();

      if (error || !data) {
        setError("Failed to load blog");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id !== data.user_id) {
        setError("Unauthorized");
        return;
      }

      setForm({
        title: data.title,
        content: data.content,
      });
    };

    fetchBlog();
  }, [blogId, supabase]);

  // ✅ Single submit handler (create + update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    let dbError;

    if (isEdit) {
      // ✏️ UPDATE
      const { error } = await supabase
        .from("blogs")
        .update({
          title: form.title,
          content: form.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blogId);

      dbError = error;
    } else {
      // 🆕 CREATE
      const { error } = await supabase.from("blogs").insert({
        user_id: user.id,
        title: form.title,
        content: form.content,
      });

      dbError = error;
    }

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push(isEdit ? `/blog/${blogId}` : "/landing");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Blog" : "Write Blog"}
      </h1>

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
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Blog"
            : "Submit"}
        </button>
      </form>
    </div>
  );
}