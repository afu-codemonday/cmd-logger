# Tech Stack
- supabase free tier for store database & auth service
- vercel free tier for hosting web, api, domain
- nextjs for webapp and api
- cron-job.org for keep schedule create mocking keep-alive record for let's supabase no pauase (at free tier)
- 80% of code made by AI :) (CHAT GPT)

# Support
- Front-end
- Back-end

<hr />

# How to use
## Create Function
```typescript
const NEXT_PUBLIC_LOG_URL = "https://lylmbftgwisgmpuxvlzz.supabase.co"
const NEXT_PUBLIC_LOG_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bG1iZnRnd2lzZ21wdXh2bHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMjgxNjcsImV4cCI6MjA0MzcwNDE2N30.wBJRRWeQ2lCJXdUhZh3Qu8niHNCPIu--ddERUYSPUGc"

const cmdLogger = (data: any) => {
  try {
    fetch(`${NEXT_PUBLIC_LOG_URL}/rest/v1/logger`, {
      body: JSON.stringify({ data }),
      headers: {
        Apikey: NEXT_PUBLIC_LOG_SECRET || '',
        Authorization: `Bearer ${NEXT_PUBLIC_LOG_SECRET || ''}`,
        "Content-Type": "application/json",
      },
      method: "POST"
    })
  } catch (e) {
    console.log('error log:', e)
  }
}

export default cmdLogger
```


## Call cmdLogger
```typescript
const exampleData = {
   id: 1,
   message: "hello log",
} // any object no required id

cmdLogger(exampleData) // pass object
```

## See log at https://cmd-logger.vercel.app/
username: `admin@codemonday.com` <br />
password: `CMD`


![image](https://github.com/user-attachments/assets/6db322ca-cc1c-4e6d-9871-eaacf2a4fa2e)
<br /><br />
![image](https://github.com/user-attachments/assets/f90b1d21-58f9-4194-96b7-aa0db34b09b1)



#### Made by afu
