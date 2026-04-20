"use client";

import { motion } from "framer-motion";

export default function ApplyPage() {
  const jobSeekerSteps = [
    "Create your free account",
    "Complete your profile & upload resume",
    "Browse internships & jobs",
    "Apply with one click",
    "Get shortlisted & attend interview"
  ];

  const employerSteps = [
    "Register as an employer",
    "Post job or internship details",
    "Review candidate applications",
    "Shortlist & schedule interviews",
    "Hire the best talent"
  ];

  return (
    <section className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            How to <span className="text-blue-600">Apply</span>
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Simple steps for both Job Seekers and Employers to get started.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* Job Seeker */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              👨‍💻 For Job Seekers
            </h2>

            <ul className="space-y-4">
              {jobSeekerSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Employer */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-6">
              🏢 For Employers
            </h2>

            <ul className="space-y-4">
              {employerSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
}