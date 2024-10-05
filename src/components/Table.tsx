"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Slide, ToastContainer, toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Table as MainTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import dayjs from 'dayjs'
import { ClipboardCopy, ExternalLink, RefreshCwIcon, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite'
import Modal from 'react-modal'
import 'react-json-view-lite/dist/index.css'
import 'react-toastify/dist/ReactToastify.css'

const Table = () => {
  const { theme } = useTheme()
  const [data, setData] = useState<{ id: number, data: any, created_at: string }[]>([])
  const [openIndex, setOpenIndex] = useState(-1)

  const getLog = async (props?: { isClick: boolean }) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    let { data: logger, error } = await supabase
      .from('logger')
      .select('*')
      .order('id', { ascending: false })

    if (!error) {
      if (props?.isClick) {
        toast.success("fetch log success", {  })
      }
      setData(logger as any)
    }
  }

  const onView = (index: number) => () => {
    setOpenIndex(index)
  }

  useEffect(() => {
    getLog()
  }, [])

  if (data.length === 0) return (
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
            <CopyToClipboard text={JSON.stringify(data[openIndex])}>
              <button className="hover:brightness-110 flex flex-row justify-center items-center gap-x-2 bg-primary mx-auto mb-4 px-4 py-2 rounded-md text-secondary transition-all duration-200">
                Copy <ClipboardCopy className="text-secondary" />
              </button>
            </CopyToClipboard>
            <JsonView
              data={data[openIndex]}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          </>
        )}
      </Modal>
      <ToastContainer 
        autoClose={1000}
        transition={Slide}
        hideProgressBar
        theme={theme}
      />
      <div
        onClick={() => getLog({ isClick: true })}
        className="flex flex-row gap-x-2 hover:bg-primary mt-2 p-4 rounded-md font-medium text-primary hover:text-white transition-all duration-200 cursor-pointer group"
      >
        <span className="group-hover:text-white text-secondary-foreground">Logs</span>
        <RefreshCwIcon />
      </div>
      <MainTable>
        <TableCaption>A list of your logs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Data</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, created_at, data }, index) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>{dayjs(created_at).format('DD/MM/YY HH:mm:ss')}</TableCell>
              <TableCell className="flex flex-row gap-x-1.5 text-xs">
                {JSON.stringify(data)}
              </TableCell>
              <TableCell onClick={onView(index)} className="w-[80px] cursor-pointer">
                <ExternalLink className="mx-auto text-blue-600" size={20} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MainTable>
    </>
  )
}

export default Table