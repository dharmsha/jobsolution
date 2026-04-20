"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);

  // Fetch jobs from Firebase
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsRef = collection(db, "jobs");
      const q = query(jobsRef, orderBy("postedAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const jobsData = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({
          id: doc.id,
          ...doc.data(),
          postedAt: doc.data().postedAt?.toDate() || new Date()
        });
      });
      
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      
      // Extract unique filters
      const uniqueLocations = [...new Set(jobsData.map(job => job.location).filter(Boolean))];
      const uniqueJobTypes = [...new Set(jobsData.map(job => job.jobType).filter(Boolean))];
      const uniqueExperience = [...new Set(jobsData.map(job => job.experience).filter(Boolean))];
      
      setLocations(uniqueLocations);
      setJobTypes(uniqueJobTypes);
      setExperienceLevels(uniqueExperience);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  // Filter jobs
  useEffect(() => {
    let filtered = jobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }
    
    if (selectedJobType) {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }
    
    if (selectedExperience) {
      filtered = filtered.filter(job => job.experience === selectedExperience);
    }
    
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedJobType, selectedExperience, jobs]);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8">
            {jobs.length}+ opportunities from top companies
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Location Filter */}
              {locations.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Job Type Filter */}
              {jobTypes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Experience Filter */}
              {experienceLevels.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Clear Filters */}
              {(selectedLocation || selectedJobType || selectedExperience || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setSelectedJobType("");
                    setSelectedExperience("");
                    setSearchTerm("");
                  }}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
              
              {/* Job Count */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-blue-600">{filteredJobs.length}</span> jobs
                </p>
              </div>
            </div>
          </div>
          
          {/* Jobs List */}
          <div className="flex-1">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {/* Job Details */}
                        <div className="flex-1">
                          {/* Company Logo Placeholder */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {job.company?.charAt(0) || "C"}
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                              </h2>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                          </div>
                          
                          {/* Job Meta Info */}
                          <div className="flex flex-wrap gap-3 mb-3">
                            {job.location && (
                              <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                              </span>
                            )}
                            
                            {job.jobType && (
                              <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {job.jobType}
                              </span>
                            )}
                            
                            {job.salary && (
                              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {job.salary}
                              </span>
                            )}
                            
                            {job.experience && (
                              <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {job.experience}
                              </span>
                            )}
                          </div>
                          
                          {/* Description Preview */}
                          {job.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {job.description}
                            </p>
                          )}
                          
                          {/* Required Skills */}
                          {job.skills && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skills.split(',').slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                  {skill.trim()}
                                </span>
                              ))}
                              {job.skills.split(',').length > 3 && (
                                <span className="text-xs text-gray-400">+{job.skills.split(',').length - 3} more</span>
                              )}
                            </div>
                          )}
                          
                          {/* Posted Time */}
                          <p className="text-xs text-gray-400">
                            Posted {formatDate(job.postedAt)}
                          </p>
                        </div>
                        
                        {/* Apply Button */}
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => {
                              // Check if user is logged in
                              const user = JSON.parse(localStorage.getItem('user') || '{}');
                              if (!user?.uid) {
                                router.push('/login?role=jobseeker');
                              } else {
                                router.push(`/jobs/${job.id}?apply=true`);
                              }
                            }}
                            className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
                          >
                            Quick Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === number
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}