"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { WaitlistWrapper } from "@/components/box"

interface ClientRedirectProps {
  url: string
}

export default function ClientRedirect({ url }: ClientRedirectProps) {
  useEffect(() => {
    window.location.href = url
  }, [url])

  return (
    <WaitlistWrapper>
      <motion.div
        className="space-y-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-12 text-balance">
          Redirecting...
        </h1>
        <div className="flex flex-col items-center gap-6">
          <p className="text-slate-10 text-pretty leading-relaxed">
            Taking you to your destination
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B051]"></div>
          <a
            href={url}
            className="text-[#06B051] hover:text-[#05A049] underline text-sm"
          >
            Click here if not redirected automatically
          </a>
        </div>
      </motion.div>
    </WaitlistWrapper>
  )
}
