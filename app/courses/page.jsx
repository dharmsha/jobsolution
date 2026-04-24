"use client";

import { useState } from "react";

const coursesData = [
  {
    id: 1,
    title: "Full Stack Web Development Program",
    category: "Development",
    duration: "6 Months",
    price: "₹12,999",
    image: "/development.png",
    description:
      "Become a job-ready Full Stack Developer with hands-on real-world projects. Includes internship experience, live project training, industry-recognized certificate, and dedicated job placement assistance.",
  },
  {
    id: 2,
    title: "Digital Marketing Mastery Program",
    category: "Marketing",
    duration: "3 Months",
    price: "₹8,999",
    image: "/digi.png",
    description:
      "Master SEO, Social Media Marketing, Ads, and Branding with live campaigns. Get internship opportunity, real client projects, certification, and job placement support after completion.",
  },
  {
    id: 3,
    title: "Data Science & AI Professional Program",
    category: "Data",
    duration: "6 Months",
    price: "₹15,999",
    image: "/datasc.png",
    description:
      "Learn Data Science, Machine Learning & AI with practical implementation. Includes industry projects, internship experience, professional certification, and placement guidance.",
  },
  {
    id: 4,
    title: "Internship For All Programs (All Domains)",
    category: "Internship",
    duration: "4 Months",
    price: "₹7,999",
    image: "/intern2.png",
    description:
      "Industry-oriented internship program across multiple domains. Work on real projects, receive verified certificate, build your portfolio, and get job placement assistance.",
  }
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Development", "Marketing", "Data", "Design"];

  const filteredCourses = coursesData.filter((course) => {
    return (
      (category === "All" || course.category === category) &&
      course.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto py-16">

      {/* HERO SECTION */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Upgrade Your Skills with Industry Courses
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn from expert instructors and boost your career with
          professional certification courses.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full md:w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full md:w-1/4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* COURSE GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {course.title}
                </h3>

                <p className="text-gray-500 mb-2">
                  Duration: {course.duration}
                </p>

                <p className="text-blue-600 font-bold mb-4">
                  {course.price}
                </p>

                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Enroll Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No courses found.</p>
        )}
      </div>
    </div>
  );
}
