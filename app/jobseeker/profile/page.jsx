"use client"

import { useState } from "react"
import { auth, db, storage } from "@/app/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ProfilePage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!auth.currentUser) {
      alert("Please login first")
      return
    }

    if (!file) {
      alert("Please select a PDF resume")
      return
    }

    // ✅ Only PDF allowed
    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed")
      return
    }

    // ✅ Max 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB")
      return
    }

    try {
      setUploading(true)

      const storageRef = ref(
        storage,
        `resumes/${auth.currentUser.uid}-${Date.now()}.pdf`
      )

      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        resumeURL: downloadURL,
        resumeUpdatedAt: new Date()
      })

      alert("Resume Uploaded Successfully ✅")
      setFile(null)

    } catch (error) {
      console.error(error)
      alert("Upload Failed ❌")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-green-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Upload Resume
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4 border p-2 rounded-lg"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>

      </div>
    </div>
  )
}