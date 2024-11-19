import { NextResponse } from "next/server"

export async function POST() {
  try {
    const NEXT_PUBLIC_LOG_URL = "https://lylmbftgwisgmpuxvlzz.supabase.co"
    const NEXT_PUBLIC_LOG_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bG1iZnRnd2lzZ21wdXh2bHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMjgxNjcsImV4cCI6MjA0MzcwNDE2N30.wBJRRWeQ2lCJXdUhZh3Qu8niHNCPIu--ddERUYSPUGc"
  
    await fetch(`${NEXT_PUBLIC_LOG_URL}/rest/v1/keepAlive`, {
      body: JSON.stringify({}),
      headers: {
        Apikey: NEXT_PUBLIC_LOG_SECRET || '',
        Authorization: `Bearer ${NEXT_PUBLIC_LOG_SECRET || ''}`,
        "Content-Type": "application/json",
      },
      method: "POST"
    })
  
    return NextResponse.json({ message: 'success keep alive' })
  } catch (e) {
    return NextResponse.json({ message: 'error keep alive', error: e })
  }
}
