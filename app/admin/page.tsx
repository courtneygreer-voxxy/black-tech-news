import { auth } from "@/auth"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Article Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage articles from Wolf Development Studio
              </p>
            </div>
          </div>
          <Link
            href="/admin/articles"
            className="mt-4 inline-block px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Articles
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Weekly Summaries
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Generate and manage weekly digest summaries
              </p>
            </div>
          </div>
          <Link
            href="/admin/summaries/weekly"
            className="mt-4 inline-block px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Manage Weekly
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Monthly Reports
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Generate and manage monthly State of Black Tech reports
              </p>
            </div>
          </div>
          <Link
            href="/admin/summaries/monthly"
            className="mt-4 inline-block px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Manage Monthly
          </Link>
        </div>
      </div>
    </div>
  )
}
