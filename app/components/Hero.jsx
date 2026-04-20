"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
            Grow Your Career with  
            <span className="text-blue-600"> Real Projects</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Our platform helps students and professionals build real-world
            skills through live internships, projects, and expert mentorship.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </Link>

            <Link
              href="/about"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="/hero-image.png"
            alt="Platform Illustration"
            className="w-full max-w-md"
          />
        </div>

      </div>
    </section>
  );
}