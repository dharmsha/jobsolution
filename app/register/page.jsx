"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/app/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker", // jobseeker or employer
    mobile: "",
    companyName: "" // only for employer
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      setLoading(false)
      return
    }

    // Validate employer company name
    if (formData.role === "employer" && !formData.companyName) {
      setError("Company name is required for employer")
      setLoading(false)
      return
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      const user = userCredential.user

      // 2. Save user data in Firestore
      const userData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        mobile: formData.mobile,
        createdAt: new Date(),
        ...(formData.role === "employer" && { companyName: formData.companyName })
      }

      await setDoc(doc(db, "users", user.uid), userData)

      // 3. Redirect to respective dashboard
      if (formData.role === "jobseeker") {
        router.push("/dashboard/jobseeker")
      } else {
        router.push("/dashboard/employer")
      }

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block font-semibold mb-2">I am a:</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "jobseeker"})}
                className={`flex-1 py-2 rounded-lg transition ${
                  formData.role === "jobseeker" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "employer"})}
                className={`flex-1 py-2 rounded-lg transition ${
                  formData.role === "employer" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Mobile Number</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {formData.role === "employer" && (
            <div>
              <label className="block font-semibold mb-2">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}