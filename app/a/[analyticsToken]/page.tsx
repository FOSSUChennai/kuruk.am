'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Copy } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AnalyticsData {
  shortCode: string
  longUrl: string
  totalClicks: number
  createdAt: string
  clicksByDay: Record<string, number>
  recentClicks: Array<{
    date: string
    referrer: string
    userAgent: string
  }>
}

export default function AnalyticsPage() {
  const params = useParams()
  const analyticsToken = params.analyticsToken as string
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics-data?token=${analyticsToken}`)
        if (!response.ok) {
          throw new Error('Analytics not found')
        }
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    if (analyticsToken) {
      fetchAnalytics()
    }
  }, [analyticsToken])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#06B051]/30 border-t-[#06B051] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">Loading analytics</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Analytics not found'}</p>
          <Link href="/" className="text-[#06B051] hover:text-[#05A049]">
            Return home
          </Link>
        </div>
      </div>
    )
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sortedClicksByDay = Object.entries(data.clicksByDay)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-30)

  const maxClicks = Math.max(...Object.values(data.clicksByDay), 1)

  const createdDate = new Date(data.createdAt)
  const createdDateStr = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#06B051] hover:text-[#05A049] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Analytics
          </h1>
          <p className="text-slate-600">View clicks and engagement metrics</p>
        </motion.div>

        {/* Short URL Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#06B051]/10 border border-[#06B051]/30 rounded-xl p-4 sm:p-6 mb-6"
        >
          <p className="text-sm text-[#06B051] font-medium mb-3">Short URL</p>
          <div className="flex items-center justify-between gap-3 bg-white rounded-lg p-3 border border-[#06B051]/20">
            <a
              href={`/${data.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#06B051] hover:text-[#05A049] font-medium truncate flex items-center gap-2"
            >
              kuruk.am/{data.shortCode}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            <button
              onClick={() => copyToClipboard(`https://kuruk.am/${data.shortCode}`)}
              className="p-2 hover:bg-[#06B051]/10 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Copy short URL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-[#06B051] font-medium mt-4 mb-2">Destination URL</p>
          <div className="bg-white rounded-lg p-3 break-all text-sm text-slate-700 border border-[#06B051]/20">
            {data.longUrl}
          </div>

          <p className="text-xs text-[#06B051] mt-3">
            Created on {createdDateStr}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-[#06B051]/10 border border-[#06B051]/30 rounded-xl p-4 sm:p-6">
            <p className="text-sm text-[#06B051] font-medium mb-2">Total Clicks</p>
            <p className="text-3xl sm:text-4xl font-bold text-[#06B051]">
              {data.totalClicks}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
            <p className="text-sm text-slate-700 font-medium mb-2">Last 30 Days</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900">
              {Object.values(data.clicksByDay).reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Clicks Over Time</h2>
          <div className="flex items-end justify-between h-40 gap-1">
            {sortedClicksByDay.map(([date, clicks], idx) => (
              <div
                key={date}
                className="flex-1 flex flex-col items-center justify-end gap-1 group"
              >
                <div
                  className="w-full bg-gradient-to-t from-[#06B051] to-[#07C05D] rounded-t opacity-75 hover:opacity-100 transition-opacity"
                  style={{
                    height: `${(clicks / maxClicks) * 100}%`,
                    minHeight: clicks > 0 ? '4px' : '0'
                  }}
                  title={`${date}: ${clicks} click${clicks !== 1 ? 's' : ''}`}
                ></div>
                {(idx % Math.ceil(sortedClicksByDay.length / 6)) === 0 && (
                  <p className="text-xs text-slate-600 mt-1 w-full text-center">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Clicks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Clicks</h2>
          {data.recentClicks.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.recentClicks.map((click, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-lg p-3 text-sm border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-medium truncate">
                        {click.referrer}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {click.userAgent}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 flex-shrink-0 ml-2">
                      {new Date(click.date).toLocaleTimeString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">
              No clicks recorded yet. Share your short URL to see analytics.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
