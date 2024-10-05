import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'

export default function Login() {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')
  }

  return (
    <div className="flex flex-col flex-1 justify-center gap-2 px-8 w-full sm:max-w-md">
      <Link
        href="/"
        className="top-8 left-8 absolute flex items-center bg-btn-background hover:bg-btn-background-hover px-4 py-2 rounded-md text-foreground text-sm no-underline group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="flex flex-col flex-1 justify-center gap-2 w-full text-foreground animate-in"
        action={signIn}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="bg-inherit mb-6 px-4 py-2 border rounded-md"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="bg-inherit mb-6 px-4 py-2 border rounded-md"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-green-700 mb-2 px-4 py-2 rounded-md text-foreground text-white">
          Sign In
        </button>
      </form>
    </div>
  )
}
