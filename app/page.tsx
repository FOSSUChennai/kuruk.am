"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { WaitlistWrapper } from "@/components/box"
import { Filter } from "bad-words";
import words from "an-array-of-english-words";
import { UrlShortenerForm } from "@/components/url-shortener-form"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { Header } from "@/components/header" // Import Header
import About from "@/components/abt-page";

export default function Home() {
  const [activeTab, setActiveTab] = useState("url"); // "url", "qr", "about"
  const [url, setUrl] = useState(""); // Shared URL state

  const filter = new Filter();

  // Helper: check if a string is a real English word
  function isEnglishWord(word: string) {
    return words.includes(word.toLowerCase())
  }

  const profaneWords = filter.list.map(w => w.toLowerCase())

  // Helper: check alias validity
  function isAliasValid(alias: string) {
    const lowerAlias = alias.toLowerCase()

    // block if alias directly matches or contains profanity
    for (const bad of profaneWords) {
      if (lowerAlias === bad) {
        return false
      }
      if (lowerAlias.includes(bad)) {
        // if it's a full dictionary word (like "classic"), allow
        if (isEnglishWord(lowerAlias)) {
          continue
        }
        return false // contains profanity inside but not a safe dictionary word
      }
    }

    return true
  }

  function isValidHttpUrl(value: string): boolean {
    const regex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return regex.test(value.trim());
  }

  const resetParentForm = () => {
    setUrl("");
    setActiveTab("url");
  };

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} /> {/* Render Header here */}
      <motion.div
        className="mx-auto"
        initial={{ maxWidth: 500 }}
        animate={{ maxWidth: activeTab === "abt" ? 1500 : 500 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
      <WaitlistWrapper>
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-12 text-balance">kuruk.am</h1>
          <p className="text-slate-10 text-pretty leading-relaxed">
            Transform your long URLs into clean, shareable links.
          </p>
        </motion.div>
        {/* <motion.div
          className="mx-auto"
          style={{ maxWidth: "600px" }}
          animate={{
            maxWidth: activeTab === "abt" ? "1200px" : "600px", // adjust as you like
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        > */}
        {activeTab === "url" && (
          <UrlShortenerForm
            isAliasValid={isAliasValid}
            isValidHttpUrl={isValidHttpUrl}
            url={url}
            setUrl={setUrl}
            resetParentForm={resetParentForm}
          />
        )}

        {activeTab === "qr" && (
          <QrCodeGenerator
            url={url}
            setUrl={setUrl}
            isValidHttpUrl={isValidHttpUrl}
          />
        )}

        {activeTab === "abt" && (
          <div className="text-slate-10 text-pretty leading-relaxed">
            <About />
          </div>
        )}
        {/* </motion.div> */}

        {/* Glassmorphism Credits Section */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="inline-block backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full px-4 py-2 shadow-lg">
            <p className="text-xs text-slate-11">
              Originally built by <a href="https://ssn.lat" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-12 hover:text-[#06B051] transition-colors">SSN Lakshya</a>
            </p>
          </div>
        </motion.div>
      </WaitlistWrapper>
      </motion.div>
    </>
  )
}
