import Image from "next/image"
import clsx from "clsx"
import type React from "react"

interface HeaderProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center absolute top-16 left-1/2 -translate-x-1/2 z-20">
      <nav className="bg-slate-1 rounded-full">
        <div
          className={clsx(
            "bg-slate-1 rounded-full p-1 flex relative items-center justify-center",
            "shadow-[0px_-1px_3px_0px_rgba(0,_0,_0,_0.05),_0px_7px_2px_0px_rgba(0,_0,_0,_0.02),_0px_4px_2px_0px_rgba(0,_0,_0,_0.05),_0px_2px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(0,_0,_0,_0.03),_0px_0_1px_0px_rgba(0,_0,_0,_0.04)]",
            "dark:shadow-[0px_-1px_3px_0px_rgba(0,_0,_0,_0.03),_0px_7px_2px_0px_rgba(0,_0,_0,_0.03),_0px_4px_2px_0px_rgba(0,_0,_0,_0.05),_0px_2px_1px_0px_rgba(0,_0,_0,_0.1),_0px_1px_1px_0px_rgba(0,_0,_0,_0.1),_0px_0px_1px_0px_rgba(0,_0,_0,_0.1)]"
          )}
        >
          <div className="flex items-center gap-6 px-6 py-3">
            <button
              onClick={() => setActiveTab("abt")}
              className={`text-lg font-medium ${activeTab === "abt" ? "text-[#06B051]" : "text-slate-10 hover:text-[#06B051]"}`}
            >
              abt
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`text-lg font-medium ${activeTab === "url" ? "text-[#06B051]" : "text-slate-10 hover:text-[#06B051]"}`}
            >
              url
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`text-lg font-medium ${activeTab === "qr" ? "text-[#06B051]" : "text-slate-10 hover:text-[#06B051]"}`}
            >
              qr
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
