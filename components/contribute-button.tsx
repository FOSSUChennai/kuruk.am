"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FiGithub, FiStar } from "react-icons/fi"

export function ContributeButton() {
  const [stars, setStars] = useState<number | null>(null)
  const repoUrl = "https://github.com/FOSSUChennai/kuruk.am"

  useEffect(() => {
    // Fetch GitHub star count
    fetch("https://api.github.com/repos/FOSSUChennai/kuruk.am")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // Silently fail - don't show stars if API fails
        setStars(null)
      })
  }, [])

  return (
    <motion.a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full px-3 py-2.5 shadow-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all hover:scale-105"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <FiGithub className="w-4 h-4 text-slate-11" />
      <span className="text-xs font-medium text-slate-11">Contribute</span>
      {stars !== null && (
        <span className="flex items-center gap-1 text-xs text-slate-11">
          <FiStar className="w-3 h-3" />
          {stars}
        </span>
      )}
    </motion.a>
  )
}
