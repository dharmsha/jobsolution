"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      // Decode company name from URL
      const companyName = id.split('-').join(' ');
      
      // Fetch all jobs
      const jobsSnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter jobs for this company
      const companyJobsData = jobsData.filter(job => 
        job.company?.toLowerCase() === companyName.toLowerCase()
      );
      
      if (companyJobsData.length === 0) {
        router.push("/companies");
        return;
      }
      
      // Get company info from first job
      const firstJob = companyJobsData[0];
      const companyInfo = {
        name: firstJob.company,
        location: firstJob.location,
        industry: firstJob.industry || "Technology",
        size: firstJob.companySize || "50-200 employees",
        description: firstJob.companyDescription || `${firstJob.company} is a leading company in the ${firstJob.industry || "tech"} industry.`,
        email: `careers@${firstJob.company.toLowerCase().replace(/\s/g, '')}.com`,
        website: `https://www.${firstJob.company.toLowerCase().replace(/\s/g, '')}.com`,
        founded: firstJob.founded || "2015",
        headquarters: firstJob.location || "India",
        jobs: companyJobsData.length
      };
      
      setCompany(companyInfo);
      setCompanyJobs(companyJobsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/companies" className="inline-flex items-center text-white/90 hover:text-white mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Companies
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-purple-600 font-bold text-4xl shadow-xl">
              {company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{company.name}</h1>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{company.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Founded {company.founded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">About {company.name}</h2>
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            </div>
            
            {/* Open Positions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Open Positions ({company.jobs})</h2>
              <div className="space-y-4">
                {companyJobs.map((job) => (
                  <Link href={`/jobs/${job.id}`} key={job.id}>
                    <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                      <h3 className="font-semibold text-lg text-gray-900 hover:text-purple-600">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {job.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.jobType && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{job.jobType}</span>
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Company Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Headquarters</p>
                  <p className="font-medium">{company.headquarters}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium">{company.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-medium">{company.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-medium">{company.founded}</p>
                </div>
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${company.email}`} className="text-purple-600 hover:underline">
                    {company.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
                  </svg>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    {company.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}