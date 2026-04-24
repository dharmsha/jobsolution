"use client"

import Link from "next/link"

export default function Footer() {
  const phoneNumber = "9341890439"
  
  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Call Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Call Us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
        
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="WhatsApp Us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </a>
      </div>

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

          {/* Contact Info */}
          <div className="mt-4 text-sm">
            <p className="flex items-center gap-2">
              <span>📞</span>
              <a href={`tel:${phoneNumber}`} className="hover:text-white">
                {phoneNumber}
              </a>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-[#1877F2] transition text-lg"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              📘
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-[#1DA1F2] transition text-lg"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-[#0A66C2] transition text-lg"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-[#E4405F] transition text-lg"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              📷
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-[#FF0000] transition text-lg"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶️
            </a>
          </div>
        </div>

        {/* Quick Links */}
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

        {/* Support */}
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

        {/* Newsletter */}
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
              className="px-4 py-2 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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