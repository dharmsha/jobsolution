"use client"

import { useRouter } from "next/navigation"

export default function AboutPage() {

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Our Job Portal
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Connecting talented jobseekers with top employers.
          We simplify hiring and make career growth easier.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to create a transparent and efficient hiring system
            where jobseekers can find opportunities easily and employers can
            hire the right talent quickly.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">
            Why Choose Us?
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li>✔ Easy Job Posting</li>
            <li>✔ Resume Upload & Tracking</li>
            <li>✔ Real-time Application Monitoring</li>
            <li>✔ Secure Login System</li>
            <li>✔ Super Admin Analytics</li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Platform Features
          </h2>
          <p className="text-gray-500 mt-3">
            Everything you need for smart hiring.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              For Jobseekers
            </h3>
            <p className="text-gray-600">
              Create profile, upload resume, apply jobs, and track your
              application status easily.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              For Employers
            </h3>
            <p className="text-gray-600">
              Post jobs, manage applicants, shortlist candidates, and monitor
              hiring process efficiently.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              For Admin
            </h3>
            <p className="text-gray-600">
              Monitor all activities, view analytics, control employers,
              and manage the entire platform.
            </p>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="mb-6 opacity-90">
          Join today and explore new career opportunities.
        </p>

        <button
          onClick={() => router.push("/register?role=jobseeker")}
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </button>
      </div>

    </div>
  )
}