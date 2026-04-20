"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            JobSolution
          </h2>
          <p className="mt-4 text-sm leading-relaxed">
            JobSolution is a modern career platform helping job seekers
            connect with top companies and build successful careers.
          </p>

          {/* Social Icons - Simple text/emoji version */}
          <div className="flex gap-4 mt-6">
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition text-lg"
              aria-label="Facebook"
            >
              📘
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-sky-500 transition text-lg"
              aria-label="Twitter"
            >
              🐦
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition text-lg"
              aria-label="LinkedIn"
            >
              🔗
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition text-lg"
              aria-label="Instagram"
            >
              📷
            </a>
          </div>
        </div>

        {/* Rest of the component remains same */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/jobs" className="hover:text-white">Browse Jobs</Link></li>
            <li><Link href="/companies" className="hover:text-white">Companies</Link></li>
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Support
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Subscribe Newsletter
          </h3>
          <p className="text-sm mb-4">
            Get latest job updates and career tips directly in your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="px-4 py-2 rounded-lg text-gray-800 w-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} JobSolution. All Rights Reserved.
      </div>

    </footer>
  )
}