# How to use

## Create Function
```typesciprt
const cmdLogger = (data: any) => {
  try {
    fetch(`${process.env.NEXT_PUBLIC_LOG_URL}/rest/v1/logger`, {
      body: JSON.stringify({ data }),
      headers: {
        Apikey: process.env.NEXT_PUBLIC_LOG_SECRET || '',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOG_SECRET || ''}`,
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
}

cmdLogger(exampleData)
```

## See log at https://cmd-logger.vercel.app/

![image](https://github.com/user-attachments/assets/6db322ca-cc1c-4e6d-9871-eaacf2a4fa2e)


#### Made by afu
