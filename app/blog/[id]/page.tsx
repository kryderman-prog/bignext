import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import DeleteButton from "@/app/components/DeleteButton"

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

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
    .eq("id", id)
    .single()

  if (error || !blog) {
    console.log("ERROR:", error)
    return <div>Blog not found</div>
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === blog.user_id

const profilesArray = Array.isArray(blog.profiles)
  ? blog.profiles
  : blog.profiles
  ? [blog.profiles]
  : []

const profileName = profilesArray[0]?.name

  return (
    <>
      {/* ✅ MAIN CONTENT */}
      <div className="max-w-3xl mx-auto mt-10">
        <h1 className="text-3xl font-bold">{blog.title}</h1>

        <p className="text-sm text-gray-500 mt-2">
          By {profileName || "Unknown"}
        </p>

        <p className="text-xs text-gray-400">
          {new Date(blog.created_at).toLocaleString()}
        </p>

        <div className="mt-6 whitespace-pre-line text-lg leading-relaxed">
          {blog.content}
        </div>
      </div>

      {/* ✅ FLOATING BUTTONS (CORRECT PLACEMENT) */}
      {isOwner && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <Link href={`/write-blog?id=${blog.id}`}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full shadow">
              Edit
            </button>
          </Link>

          <DeleteButton blogId={blog.id} />
        </div>
      )}
    </>
  )
}