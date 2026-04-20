"use client";

import { motion } from "framer-motion";

export default function FeaturesSection() {
  const features = [
    {
      icon: "💼",
      title: "Live Internships",
      description: "Work on real industry projects and build a strong portfolio."
    },
    {
      icon: "🚀",
      title: "Real Projects",
      description: "Hands-on experience solving real business problems."
    },
    {
      icon: "🎓",
      title: "Expert Mentorship",
      description: "Learn directly from industry professionals."
    },
    {
      icon: "📜",
      title: "Verified Certificates",
      description: "Industry-recognized certificates to boost your resume."
    },
    {
      icon: "🤝",
      title: "Placement Support",
      description: "Dedicated assistance to help you land your dream job."
    },
    {
      icon: "💡",
      title: "Strong Community",
      description: "Collaborate and grow with ambitious learners."
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
            Why Choose <span className="text-blue-600">Us?</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We help students and professionals gain real-world experience and accelerate their career growth.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}