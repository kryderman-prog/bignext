import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()

  const { page: pageParam } = await searchParams
const page = parseInt(pageParam || "1", 10)
  const limit = 9
  const offset = (page - 1) * limit

  // Fetch blogs
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(`
      id,
      title,
      content,
      created_at,
      profiles ( name )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(error)
    return <div>Error loading blogs</div>
  }

  // Get total count for pagination
  const { count } = await supabase
    .from("blogs")
    .select("*", { count: "exact", head: true })

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs?.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="block border rounded-lg p-4 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {blog.title}
            </h2>

            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {blog.content}
            </p>

            <p className="text-xs text-gray-400">
              By {blog.profiles?.[0]?.name || "Unknown"}
            </p>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1

          return (
            <Link
              key={pageNumber}
              href={`/landing?page=${pageNumber}`}
              className={`px-4 py-2 border rounded ${
                page === pageNumber
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {pageNumber}
            </Link>
          )
        })}
      </div>
    </div>
  )
}