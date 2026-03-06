import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-gray-1/85 rounded-2xl p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-12 mb-4">URL Not Found</h2>
        <p className="text-slate-10 mb-6">
          The short URL you're looking for doesn't exist or has expired.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#06B051] to-[#05A049] hover:from-[#05A049] hover:to-[#049041] text-white font-medium rounded-xl transition-all duration-200"
        >
          Create New Short URL
        </Link>
      </div>
    </div>
  )
}