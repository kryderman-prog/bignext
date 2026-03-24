import { createClient } from "@/lib/supabase/server";
export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ FIX

  const supabase = await createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select(`
      id,
      title,
      content,
      created_at,
      user_id,
      profiles (
        name
      )
    `)
    .eq("id", id) // ✅ use extracted id
    .single();

  if (error || !blog) {
    console.log("ERROR:", error);
    console.log("BLOG:", blog);
    return <div>Blog not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">{blog.title}</h1>

      <p className="text-sm text-gray-500 mt-2">
        By {blog.profiles?.name || "Unknown"}
      </p>

      <p className="text-xs text-gray-400">
        {new Date(blog.created_at).toLocaleString()}
      </p>

      <div className="mt-6 whitespace-pre-line text-lg leading-relaxed">
        {blog.content}
      </div>
    </div>
  );
}