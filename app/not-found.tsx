import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-4">Could not find the requested resource</p>
      <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">
        Return Home
      </Link>
    </div>
  )
} 