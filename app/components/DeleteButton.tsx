"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteButton({ blogId }: { blogId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    const supabase = createClient()

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", blogId)

    if (error) {
      console.error(error)
      return
    }

    router.push("/landing")
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded-full shadow"
    >
      Delete
    </button>
  )
}