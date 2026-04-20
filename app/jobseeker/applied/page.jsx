"use client"

import { useEffect, useState } from "react"
import { db, auth } from "@/app/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export default function AppliedPage() {

  const [applications, setApplications] = useState([])

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser

      const q = query(
        collection(db, "applications"),
        where("userId", "==", user.uid)
      )

      const querySnapshot = await getDocs(q)
      setApplications(querySnapshot.docs.map(doc => doc.data()))
    }

    fetchApplications()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold mb-6">Your Applications</h2>

      <div className="space-y-4">

        {applications.map((app, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p>Status: <span className="font-semibold">{app.status}</span></p>
          </div>
        ))}

      </div>

    </div>
  )
}