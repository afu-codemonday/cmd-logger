"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Slide, ToastContainer, toast } from 'react-toastify'
import React, { useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import dayjs from 'dayjs'
import { ClipboardCopy, ExternalLink, RefreshCwIcon, X } from 'lucide-react'
import { useTheme } from 'next-themes'
// import { JsonView, allExpanded, defaultStyles }? from 'react-json-view-lite'
// import { TableWithBrowserPagination, Column } from 'react-rainbow-components'
import Modal from 'react-modal'
// import 'react-json-view-lite/dist/index.css'
// import 'react-toastify/dist/ReactToastify.css'
import { TableVirtuoso } from 'react-virtuoso'

const Spinner = () => (
  <div role="status" className="mt-8">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 dark:text-gray-600 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
  </div>
)

const Table = () => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{ id: number, data: any, created_at: string }[]>([])
  const [openIndex, setOpenIndex] = useState(-1)

  const isCallingApi = useRef(false)

  const getLog = async (props?: { isClick: boolean }) => {
    if (!isCallingApi.current) {
      setIsLoading(true)
      isCallingApi.current = true
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
  
      let { data: logger, error } = await supabase
        .from('logger')
        .select('*')
        .order('id', { ascending: false })
        .limit(100)
  
      if (!error) {
        if (props?.isClick) {
          toast.success("fetch log success", {  })
        }
        setData(logger as any)
      } else {
        toast.error(error.message)
      }

      isCallingApi.current = false
      setIsLoading(false)
    }
  }

  const onView = (index: number) => () => {
    setOpenIndex(index)
  }

  useEffect(() => {
    getLog()
  }, [])

  if (data.length === 0 && !isLoading) return (
    <div className="mt-8 text-base text-muted-foreground">
      Login for see logs
    </div>
  )

  return (
    <>
      <Modal
        isOpen={openIndex !== -1}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
        }}
        onRequestClose={() => setOpenIndex(-1)}
      >
        <div
          onClick={() => setOpenIndex(-1)}
          className="top-4 right-4 absolute p-2 cursor-pointer"
        >
          <X className="text-black text-xl" />
        </div>
        {openIndex !== -1 && (
          <>
            <CopyToClipboard text={JSON.stringify(data[openIndex])} onCopy={() => toast.success('Copy success')}>
              <button className="hover:brightness-110 flex flex-row justify-center items-center gap-x-2 bg-primary mx-auto mb-4 px-4 py-2 rounded-md text-secondary transition-all duration-200">
                Copy <ClipboardCopy className="text-secondary" />
              </button>
            </CopyToClipboard>
            <pre className="text-xs">
              {JSON.stringify(data[openIndex], null, 2)}
            </pre>
            {/* <JsonView
              data={}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            /> */}
          </>
        )}
      </Modal>
      <ToastContainer 
        autoClose={1000}
        transition={Slide}
        hideProgressBar
        theme={theme}
      />
      {!isLoading && (
      <div
        onClick={() => getLog({ isClick: true })}
        className="flex flex-row gap-x-2 hover:bg-primary mt-2 p-4 rounded-md font-medium text-primary hover:text-white transition-all duration-200 cursor-pointer group"
      >
        <span className="group-hover:text-white text-secondary-foreground">Refresh Logs</span>
        <RefreshCwIcon />
      </div>
      )}
      {isLoading && <Spinner />}
      <TableVirtuoso
        className="flex flex-1 my-auto w-full"
        data={data}
        itemContent={(index, item) => {
          const text = JSON.stringify(item.data).slice(0, 300)

          return (
            <>
              <td className="border-[1px] p-1.5 w-20 text-center text-sm whitespace-pre-line">{item.id}</td>
              <td className="border-[1px] p-1.5 w-20 text-sm whitespace-pre">{dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</td>
              <td className="border-[1px] line-clamp-2 p-1.5 text-sm">{text}</td>
              <td onClick={onView(index)} className="border-[1px] p-1.5 w-20 text-sm cursor-pointer">
                <ExternalLink className="mx-auto text-blue-600" size={20} />
              </td>
            </>
          )
        }}
      />
      <div className="mt-4 text-center text-gray-400 text-sm">
        --- for performance (free tier) this log show only lastest 100 items ---
      </div>
      <div className="h-4" />
    </>
  )
}

export default Table
