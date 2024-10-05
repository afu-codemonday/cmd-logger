import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="bg-btn-background hover:bg-btn-background-hover px-4 py-2 rounded-md no-underline">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="flex bg-btn-background hover:bg-btn-background-hover px-3 py-2 rounded-md no-underline"
    >
      Login
    </Link>
  )
}
