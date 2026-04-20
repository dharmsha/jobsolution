"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Sample blog data (in real app, fetch from Firebase or CMS)
const blogsData = [
  {
    id: 1,
    title: "10 Tips to Crack Your Dream Job Interview in 2024",
    slug: "tips-to-crack-job-interview",
    excerpt: "Learn the proven strategies that helped thousands of candidates land their dream jobs. From preparation to follow-up, we cover everything.",
    content: "Full content here...",
    author: "Rahul Sharma",
    authorAvatar: "/avatars/rahul.jpg",
    category: "Career Advice",
    readTime: "5 min read",
    date: "2024-01-15",
    image: "/blog-images/interview-tips.jpg",
    tags: ["Interview", "Career", "Tips"],
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: "Top 10 In-Demand Skills for 2024",
    slug: "top-in-demand-skills-2024",
    excerpt: "Stay ahead of the curve with these high-demand skills that employers are looking for right now.",
    content: "Full content here...",
    author: "Priya Patel",
    authorAvatar: "/avatars/priya.jpg",
    category: "Skills Development",
    readTime: "7 min read",
    date: "2024-01-10",
    image: "/blog-images/skills.jpg",
    tags: ["Skills", "Career Growth", "Learning"],
    views: 2100,
    likes: 156
  },
  {
    id: 3,
    title: "How to Build a Portfolio That Gets You Hired",
    slug: "build-portfolio-that-gets-you-hired",
    excerpt: "A step-by-step guide to creating an impressive portfolio that showcases your best work and attracts recruiters.",
    content: "Full content here...",
    author: "Amit Kumar",
    authorAvatar: "/avatars/amit.jpg",
    category: "Portfolio",
    readTime: "6 min read",
    date: "2024-01-05",
    image: "/blog-images/portfolio.jpg",
    tags: ["Portfolio", "Projects", "Hiring"],
    views: 980,
    likes: 67
  },
  {
    id: 4,
    title: "Remote Work: Challenges and Solutions",
    slug: "remote-work-challenges-solutions",
    excerpt: "Master the art of working from home with these practical tips to stay productive and maintain work-life balance.",
    content: "Full content here...",
    author: "Neha Gupta",
    authorAvatar: "/avatars/neha.jpg",
    category: "Remote Work",
    readTime: "4 min read",
    date: "2024-01-01",
    image: "/blog-images/remote-work.jpg",
    tags: ["Remote Work", "Productivity", "Work-Life Balance"],
    views: 1560,
    likes: 112
  },
  {
    id: 5,
    title: "Salary Negotiation Strategies That Work",
    slug: "salary-negotiation-strategies",
    excerpt: "Don't leave money on the table! Learn proven negotiation tactics to get the salary you deserve.",
    content: "Full content here...",
    author: "Vikram Singh",
    authorAvatar: "/avatars/vikram.jpg",
    category: "Career Advice",
    readTime: "8 min read",
    date: "2023-12-28",
    image: "/blog-images/salary.jpg",
    tags: ["Salary", "Negotiation", "Career"],
    views: 1870,
    likes: 143
  },
  {
    id: 6,
    title: "The Future of AI in Recruitment",
    slug: "future-of-ai-in-recruitment",
    excerpt: "Explore how artificial intelligence is transforming the hiring process and what it means for job seekers.",
    content: "Full content here...",
    author: "Dr. Anjali Mehta",
    authorAvatar: "/avatars/anjali.jpg",
    category: "Technology",
    readTime: "6 min read",
    date: "2023-12-20",
    image: "/blog-images/ai-recruitment.jpg",
    tags: ["AI", "Recruitment", "Future"],
    views: 2340,
    likes: 198
  }
];

// Get unique categories
const categories = [...new Set(blogsData.map(blog => blog.category))];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(blogsData);
  const [filteredBlogs, setFilteredBlogs] = useState(blogsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [featuredBlog, setFeaturedBlog] = useState(blogsData[0]);

  // Filter blogs
  useEffect(() => {
    let filtered = blogs;
    
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(blog => blog.tags.includes(selectedTag));
    }
    
    setFilteredBlogs(filtered);
  }, [searchTerm, selectedCategory, selectedTag, blogs]);

  // Get all unique tags
  const allTags = [...new Set(blogs.flatMap(blog => blog.tags))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Career Insights & Tips
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expert advice, industry trends, and practical tips to accelerate your career growth
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles by title, topic, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 text-gray-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Featured Blog */}
        {!searchTerm && !selectedCategory && !selectedTag && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            <Link href={`/blogs/${featuredBlog.slug}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="text-lg font-semibold">Featured</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                        {featuredBlog.category}
                      </span>
                      <span className="text-sm text-gray-500">{featuredBlog.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {featuredBlog.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {featuredBlog.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{featuredBlog.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(featuredBlog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👁️ {featuredBlog.views}</span>
                        <span>❤️ {featuredBlog.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Popular Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popular Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedTag === tag
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Clear Filters */}
              {(selectedCategory || selectedTag || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedTag("");
                    setSearchTerm("");
                  }}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
              
              {/* Blog Count */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-blue-600">{filteredBlogs.length}</span> articles
                </p>
              </div>
            </div>
          </div>
          
          {/* Blog Grid */}
          <div className="flex-1">
            {filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <Link href={`/blogs/${blog.slug}`} key={blog.id}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">
                      {/* Blog Image */}
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <div className="text-5xl">
                          {blog.category === "Career Advice" && "💼"}
                          {blog.category === "Skills Development" && "🎯"}
                          {blog.category === "Portfolio" && "📁"}
                          {blog.category === "Remote Work" && "🏠"}
                          {blog.category === "Technology" && "🤖"}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                            {blog.category}
                          </span>
                          <span className="text-xs text-gray-500">{blog.readTime}</span>
                        </div>
                        
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                                {blog.author.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-xs">{blog.author}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>👁️ {blog.views}</span>
                              <span>❤️ {blog.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Load More Button */}
            {filteredBlogs.length >= 6 && (
              <div className="text-center mt-12">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                  Load More Articles
                </button>
              </div>
            )}
          </div>
          
        </div>
        
        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">Never Miss an Update</h3>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter and get the latest career insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}