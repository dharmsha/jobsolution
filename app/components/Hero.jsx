"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
            Grow Your Career with
            <span className="text-blue-600"> Real Projects</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Founded by <span className="font-semibold text-gray-800">Jyoti Kumar</span>, 
            our platform helps students and professionals build real-world
            skills through live internships, projects, and expert mentorship.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
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
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/jks.png"
            alt="Founder Jyoti Kumar"
            className="w-full max-w-md drop-shadow-xl rounded-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}