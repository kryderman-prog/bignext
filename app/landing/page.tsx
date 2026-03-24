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
    <div>
      {blogs?.map((blog) => (
        <Link key={blog.id} href={`/blog/${blog.id}`}>
          {blog.title}
        </Link>
      ))}
    </div>
  );
}