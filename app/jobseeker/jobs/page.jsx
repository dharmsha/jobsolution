"use client"
import { useEffect, useState } from "react"
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/app/lib/firebase"

export default function JobsPage() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"))
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    fetchJobs()
  }, [])

  const applyJob = async (job) => {
    await addDoc(collection(db, "applications"), {
      jobId: job.id,
      applicantId: auth.currentUser.uid,
      employerId: job.employerId,
      status: "pending",
      appliedAt: serverTimestamp()
    })
    alert("Applied Successfully")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>

      {jobs.map(job => (
        <div key={job.id} className="bg-white p-5 shadow rounded-xl mb-4">
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p>{job.location}</p>
          <button
            onClick={() => applyJob(job)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  )
}