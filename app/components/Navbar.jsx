"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavigation = (role) => {
    setIsOpen(false)
    router.push(`/login?role=${role}`)
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Courses", path: "/courses" },
    { name: "Blogs", path: "/blogs" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact", path: "/contact" }
  ]

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/job.png"
              alt="JobSolution Logo"
              className="h-10 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-blue-600">
                Job<span className="text-green-500">Solution</span>
              </span>
              <span className="text-xs text-gray-500">
                A Career Growth Platform
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`relative transition duration-300 hover:text-blue-600 ${
                  isActive(link.path)
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {link.name}

                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded"></span>
                )}
              </Link>
            ))}
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex gap-4">
            <button
              onClick={() => handleNavigation("jobseeker")}
              className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition duration-300"
            >
              Jobseeker
            </button>

            <button
              onClick={() => handleNavigation("employer")}
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Employer
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md shadow-xl px-6 pb-6 space-y-5">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block font-medium transition ${
                isActive(link.path)
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t space-y-3">
            <button
              onClick={() => handleNavigation("jobseeker")}
              className="w-full py-3 rounded-full border border-blue-600 text-blue-600 font-medium"
            >
              Jobseeker
            </button>

            <button
              onClick={() => handleNavigation("employer")}
              className="w-full py-3 rounded-full bg-blue-600 text-white font-medium shadow-md"
            >
              Employer
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}