import AuthButton from '@/components/AuthButton'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import Table from '@/components/Table'

export default async function Index() {
  const cookieStore = cookies()
  const canInitSupabaseClient = () => {
    try {
      createServerClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <div className="flex flex-col flex-1 items-center w-full">
      <nav className="flex justify-center border-b border-b-foreground/10 w-full h-16">
        <div className="flex justify-between items-center p-3 w-full text-sm">
          {isSupabaseConnected && <AuthButton />}
          <div className="font-medium text-primary whitespace-pre">Codemonday Logger</div>
        </div>
      </nav>
      <Table />
      <footer className="flex flex-row justify-center items-center gap-x-2 mt-auto p-2 border-t border-t-foreground/10 w-full text-center text-xs">
        <p>Made by{' '}<a href="#" className="font-bold hover:underline" rel="noreferrer">AFU</a></p>
        <ThemeToggle />
      </footer>
    </div>
  )
}
