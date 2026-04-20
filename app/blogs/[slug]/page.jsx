"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Same blog data (in real app, fetch from API)
const blogsData = {
  "tips-to-crack-job-interview": {
    id: 1,
    title: "10 Tips to Crack Your Dream Job Interview in 2024",
    excerpt: "Learn the proven strategies that helped thousands of candidates land their dream jobs.",
    content: `
      <h2>1. Research the Company Thoroughly</h2>
      <p>Before any interview, spend at least 2-3 hours researching the company. Understand their products, services, culture, values, and recent news. This shows genuine interest and helps you tailor your answers.</p>
      
      <h2>2. Practice Common Interview Questions</h2>
      <p>Prepare answers for common questions like "Tell me about yourself", "Why do you want to work here?", and "What are your strengths and weaknesses?". Practice out loud to build confidence.</p>
      
      <h2>3. Showcase Your Achievements with STAR Method</h2>
      <p>Use the Situation, Task, Action, Result framework to structure your answers. This makes your responses clear, concise, and impactful.</p>
      
      <h2>4. Ask Intelligent Questions</h2>
      <p>Prepare 3-5 thoughtful questions about the role, team, or company. This demonstrates your engagement and critical thinking.</p>
      
      <h2>5. Dress Professionally</h2>
      <p>First impressions matter. Dress appropriately for the company culture. When in doubt, it's better to be slightly overdressed than underdressed.</p>
      
      <h2>6. Arrive Early</h2>
      <p>Plan to arrive 10-15 minutes early. This gives you time to compose yourself and shows reliability.</p>
      
      <h2>7. Bring Necessary Documents</h2>
      <p>Carry multiple copies of your resume, portfolio, references, and any other relevant documents in a professional folder.</p>
      
      <h2>8. Follow Up After Interview</h2>
      <p>Send a thank-you email within 24 hours. Reiterate your interest and highlight key points from the conversation.</p>
      
      <h2>9. Be Authentic</h2>
      <p>Don't try to be someone you're not. Authenticity resonates with interviewers and helps determine if you're a good cultural fit.</p>
      
      <h2>10. Stay Positive and Confident</h2>
      <p>Maintain a positive attitude throughout. Even if you stumble, recover gracefully. Confidence comes from preparation.</p>
    `,
    author: "Rahul Sharma",
    authorBio: "Senior Career Coach with 10+ years of experience helping professionals land their dream jobs.",
    category: "Career Advice",
    readTime: "5 min read",
    date: "2024-01-15",
    tags: ["Interview", "Career", "Tips"],
    views: 1250,
    likes: 89
  }
};

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogData = blogsData[slug];
    if (blogData) {
      setBlog(blogData);
    } else {
      router.push("/blogs");
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blogs
        </Link>

        {/* Blog Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <div className="text-8xl">
              {blog.category === "Career Advice" && "💼"}
              {blog.category === "Skills Development" && "🎯"}
              {blog.category === "Portfolio" && "📁"}
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {blog.category}
              </span>
              <span className="text-sm text-gray-500">{blog.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-lg">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{blog.author}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                  ❤️ {blog.likes}
                </button>
                <button className="flex items-center gap-1 text-gray-500">
                  🔗 Share
                </button>
              </div>
            </div>
            
            {/* Blog Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Tags */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link key={tag} href={`/blogs?tag=${tag}`}>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Author Bio */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{blog.author}</h4>
                  <p className="text-gray-600 text-sm">{blog.authorBio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}