import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient(); // ✅ FIX

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(`
      id,
      title,
      content,
      created_at,
      profiles (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading blogs</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs?.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.id}`}
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          <h2 className="text-xl font-bold mb-3 text-gray-900">{blog.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {blog.content.substring(0, 120)}{blog.content.length > 120 ? "..." : ""}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              By {((Array.isArray(blog.profiles)
                ? (blog.profiles[0] as { name?: string })?.name
                : (blog.profiles as { name?: string } | undefined)?.name) || "Anonymous")}
            </span>
            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}