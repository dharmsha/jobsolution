"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // FAQ Categories
  const categories = [
    { id: "all", name: "All Questions", icon: "📚" },
    { id: "general", name: "General", icon: "💡" },
    { id: "application", name: "Applications", icon: "📝" },
    { id: "account", name: "Account & Dashboard", icon: "👤" },
    { id: "employer", name: "For Employers", icon: "🏢" }
  ];

  // FAQs Data
  const faqsData = [
    {
      id: 1,
      question: "What is JobCliff?",
      answer: "JobCliff is a platform where jobseekers can search and apply for jobs, create resumes, track applications, and get hired by top companies.",
      category: "general"
    },
    {
      id: 2,
      question: "Is JobCliff free for jobseekers?",
      answer: "Yes, JobCliff is 100% free for all jobseekers. There are no hidden charges or subscription fees.",
      category: "general"
    },
    {
      id: 3,
      question: "How do I apply for a job?",
      answer: "Search your desired job → click Apply Now → submit your application. It's that simple!",
      category: "application"
    },
    {
      id: 4,
      question: "Can employers post multiple jobs?",
      answer: "Yes. You can submit multiple openings. There's no limit on the number of jobs you can post.",
      category: "employer"
    },
    {
      id: 5,
      question: "How will I know if I'm shortlisted?",
      answer: "You'll receive a notification email if you are shortlisted. You can also check your dashboard for updates.",
      category: "application"
    },
    {
      id: 6,
      question: "How can I track my application status?",
      answer: "Go to Dashboard to see status: Applied, Viewed, Shortlisted, Rejected, or Hired. We keep you updated at every step.",
      category: "application"
    },
    {
      id: 7,
      question: "Can I edit my profile after submitting?",
      answer: "Yes, all sections (education, experience, skills, projects) can be edited anytime from your dashboard.",
      category: "account"
    },
    {
      id: 8,
      question: "Does JobCliff guarantee job placement?",
      answer: "JobCliff connects you with employers but does not guarantee job placement. We provide the platform and opportunities - success depends on your skills and interview performance.",
      category: "general"
    },
    {
      id: 9,
      question: "How do I create a resume on JobCliff?",
      answer: "Go to your Dashboard → Resume Builder → Fill in your details → Download PDF. You can also upload an existing resume.",
      category: "account"
    },
    {
      id: 10,
      question: "Can I apply from mobile?",
      answer: "Absolutely! JobCliff is fully responsive and works on all devices - mobile, tablet, or desktop.",
      category: "general"
    },
    {
      id: 11,
      question: "How long does it take to get a response?",
      answer: "Response time varies by employer. Typically, you'll hear back within 1-2 weeks. Check your dashboard for status updates.",
      category: "application"
    },
    {
      id: 12,
      question: "Is my data secure?",
      answer: "Yes! We use industry-standard encryption to protect your personal information. We never share your data without consent.",
      category: "account"
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqsData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section - Exactly like JobCliff */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm mb-4 backdrop-blur">
            Empowering Future Citizens with Essential Life Skills
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FAQs
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Frequently Asked Questions
          </p>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto">
            We understand you may have questions before getting started. To make things easier, 
            we've gathered a list of the most frequently asked questions along with clear, 
            straightforward answers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search your question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-gray-900 border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your search or filter</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions? Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Get Started
            </Link>
          </div>
        </div>

        {/* Trust Badges - Like JobCliff */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Proud partner of leading government bodies</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            <span className="text-gray-600 font-semibold">NSDC</span>
            <span className="text-gray-600 font-semibold">MSDE</span>
            <span className="text-gray-600 font-semibold">NASSCOM</span>
            <span className="text-gray-600 font-semibold">Startup India</span>
          </div>
        </div>

      </div>
    </div>
  );
}