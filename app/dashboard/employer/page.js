"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/login?role=employer");
      return;
    }
    fetchEmployerStats();
  }, []);

  const fetchEmployerStats = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Fetch employer's jobs
    const jobsQuery = query(collection(db, "jobs"), where("employerId", "==", user.uid));
    const jobsSnapshot = await getDocs(jobsQuery);
    const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch all applications
    const applicationsSnapshot = await getDocs(collection(db, "applications"));
    const allApplications = applicationsSnapshot.docs.map(doc => doc.data());
    
    const jobIds = jobs.map(job => job.id);
    const applicantsForMyJobs = allApplications.filter(app => jobIds.includes(app.jobId));
    
    setStats({
      totalJobs: jobs.length,
      totalApplicants: applicantsForMyJobs.length,
      activeJobs: jobs.filter(job => job.status === "active").length
    });
    
    setRecentJobs(jobs.slice(0, 5));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Applicants</p>
              <p className="text-3xl font-bold">{stats.totalApplicants}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold">{stats.activeJobs}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/employer/post-job" className="bg-blue-600 text-white p-4 rounded-xl text-center hover:bg-blue-700 transition">
          ➕ Post New Job
        </Link>
        <Link href="/dashboard/employer/jobs" className="bg-purple-600 text-white p-4 rounded-xl text-center hover:bg-purple-700 transition">
          📋 View All Jobs
        </Link>
        <Link href="/dashboard/employer/applicants" className="bg-green-600 text-white p-4 rounded-xl text-center hover:bg-green-700 transition">
          👥 View Applicants
        </Link>
      </div>
      
      {/* Recent Jobs */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Jobs Posted</h2>
        {recentJobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="space-y-3">
            {recentJobs.map(job => (
              <div key={job.id} className="border p-3 rounded-lg">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}