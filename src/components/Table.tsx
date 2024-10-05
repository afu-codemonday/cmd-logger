"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Slide, ToastContainer, toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import dayjs from 'dayjs'
import { ClipboardCopy, ExternalLink, RefreshCwIcon, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite'
import { TableWithBrowserPagination, Column } from 'react-rainbow-components'
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
    } else {
      toast.error(error.message)
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
            <CopyToClipboard text={JSON.stringify(data[openIndex])} onCopy={() => toast.success('Copy success')}>
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
        <span className="group-hover:text-white text-secondary-foreground">Refresh Logs</span>
        <RefreshCwIcon />
      </div>
      <TableWithBrowserPagination
        className="mt-4"
        pageSize={20}
        data={data}
        keyField="id"
      >
        <Column width={100} header="Id" field="id" />
        <Column width={200} header="Create At" field="created_at" component={({ value }: any) => <div>{dayjs(value).format('DD/MM/YY HH:mm:ss')}</div>} />
        <Column header="Data" field="data" component={({ value }: any) => <div className="line-clamp-3">{JSON.stringify(value)}</div>} />
        <Column
          width={80}
          component={({ value, index }: any) => (
            <div onClick={onView(index)} className="pt-2 w-[80px] h-full">
              <ExternalLink className="mx-auto text-blue-600" size={20} />
            </div>
          )}
        />
      </TableWithBrowserPagination>
      <div className="h-4" />
    </>
  )
}

export default Table
