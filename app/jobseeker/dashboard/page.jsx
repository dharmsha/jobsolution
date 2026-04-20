"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "@/app/lib/firebase"

export default function JobseekerDashboard() {
  const [appliedCount, setAppliedCount] = useState(0)

  useEffect(() => {
    if (!auth.currentUser) return

    const fetchData = async () => {
      const q = query(
        collection(db, "applications"),
        where("applicantId", "==", auth.currentUser.uid)
      )
      const snapshot = await getDocs(q)
      setAppliedCount(snapshot.size)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold mb-8 text-blue-600">
        Jobseeker Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Upload Resume */}
        <Link
          href="/jobseeker/profile"
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold mb-2">Upload Resume</h2>
          <p className="text-gray-500">
            Add or update your resume to apply for jobs.
          </p>
        </Link>

        {/* Browse Jobs */}
        <Link
          href="/jobseeker/jobs"
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold mb-2">Browse Jobs</h2>
          <p className="text-gray-500">
            Explore available job opportunities.
          </p>
        </Link>

        {/* Applied Jobs */}
        <Link
          href="/jobseeker/applied"
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold mb-2">Applied Jobs</h2>
          <p className="text-gray-500">
            Track your application status.
          </p>
          <p className="text-blue-600 text-2xl font-bold mt-2">
            {appliedCount}
          </p>
        </Link>

      </div>

    </div>
  )
}