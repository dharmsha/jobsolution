"use client";

import { useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    experience: "Fresher",
    description: "",
    requirements: "",
    benefits: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const user = auth.currentUser;
    if (!user) {
      alert("Please login again");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        ...jobData,
        employerId: user.uid,
        postedAt: new Date(),
        status: "active"
      });
      
      alert("Job posted successfully!");
      router.push("/dashboard/employer/jobs");
    } catch (error) {
      alert("Error posting job: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Job Title *</label>
            <input
              type="text"
              required
              value={jobData.title}
              onChange={(e) => setJobData({...jobData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Senior React Developer"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Company Name *</label>
            <input
              type="text"
              required
              value={jobData.company}
              onChange={(e) => setJobData({...jobData, company: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Your company name"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Location *</label>
            <input
              type="text"
              required
              value={jobData.location}
              onChange={(e) => setJobData({...jobData, location: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Mumbai, Remote"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Salary Range</label>
            <input
              type="text"
              value={jobData.salary}
              onChange={(e) => setJobData({...jobData, salary: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., ₹30,000 - ₹50,000"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Job Type</label>
            <select
              value={jobData.jobType}
              onChange={(e) => setJobData({...jobData, jobType: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Remote</option>
              <option>Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Experience Required</label>
            <select
              value={jobData.experience}
              onChange={(e) => setJobData({...jobData, experience: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option>Fresher</option>
              <option>1-2 years</option>
              <option>3-5 years</option>
              <option>5-8 years</option>
              <option>8+ years</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-semibold mb-2">Job Description *</label>
          <textarea
            required
            rows="5"
            value={jobData.description}
            onChange={(e) => setJobData({...jobData, description: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="Describe the role, responsibilities, etc."
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-2">Requirements *</label>
          <textarea
            required
            rows="3"
            value={jobData.requirements}
            onChange={(e) => setJobData({...jobData, requirements: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="List required skills, qualifications, etc."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {loading ? "Posting Job..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}