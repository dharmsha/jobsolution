"use client";

import { useEffect, useState, Suspense } from "react";
import { auth, db } from "@/app/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Main component that uses useSearchParams - wrapped with Suspense
function ApplicantsContent() {
  const searchParams = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");
  
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(jobIdFilter || "");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Fetch employer's jobs
      const jobsQuery = query(collection(db, "jobs"), where("employerId", "==", user.uid));
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsList = jobsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setJobs(jobsList);

      // Fetch all applications
      const applicationsSnapshot = await getDocs(collection(db, "applications"));
      const allApplications = applicationsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate() || new Date()
      }));
      
      // Filter applications for employer's jobs
      const employerJobIds = jobsList.map(job => job.id);
      const employerApplications = allApplications.filter(app => 
        employerJobIds.includes(app.jobId)
      );
      
      setApplications(employerApplications);
      setFilteredApplications(employerApplications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Filter applications
  useEffect(() => {
    let filtered = applications;
    
    if (selectedJob) {
      filtered = filtered.filter(app => app.jobId === selectedJob);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userMobile?.includes(searchTerm)
      );
    }
    
    setFilteredApplications(filtered);
  }, [selectedJob, selectedStatus, searchTerm, applications]);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, "applications", applicationId);
      await updateDoc(applicationRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      alert(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "shortlisted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "viewed": return "bg-blue-100 text-blue-700";
      case "hired": return "bg-purple-100 text-purple-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "shortlisted": return "✅";
      case "rejected": return "❌";
      case "viewed": return "👁️";
      case "hired": return "🎉";
      default: return "⏳";
    }
  };

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || "Unknown Job";
  };

  const getJobLocation = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.location || "N/A";
  };

  const stats = {
    total: filteredApplications.length,
    shortlisted: filteredApplications.filter(a => a.status === "shortlisted").length,
    viewed: filteredApplications.filter(a => a.status === "viewed").length,
    hired: filteredApplications.filter(a => a.status === "hired").length,
    rejected: filteredApplications.filter(a => a.status === "rejected").length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-600 mt-1">Manage and track all job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow border border-green-100">
          <p className="text-sm text-green-600">Shortlisted</p>
          <p className="text-2xl font-bold text-green-700">{stats.shortlisted}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow border border-blue-100">
          <p className="text-sm text-blue-600">Viewed</p>
          <p className="text-2xl font-bold text-blue-700">{stats.viewed}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl shadow border border-purple-100">
          <p className="text-sm text-purple-600">Hired</p>
          <p className="text-2xl font-bold text-purple-700">{stats.hired}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow border border-red-100">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} ({job.location})</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="viewed">Viewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
        
        {(selectedJob || selectedStatus || searchTerm) && (
          <div className="mt-3 text-right">
            <button
              onClick={() => {
                setSelectedJob("");
                setSelectedStatus("");
                setSearchTerm("");
              }}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {selectedJob || selectedStatus || searchTerm 
              ? "Try adjusting your filters" 
              : "No one has applied to your jobs yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Applicant Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {application.userName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {application.userName || "Anonymous User"}
                      </h3>
                      <p className="text-sm text-gray-500">{application.userEmail}</p>
                      <p className="text-sm text-gray-500">{application.userMobile || "No mobile provided"}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Applied for</p>
                      <p className="font-semibold text-gray-900">{getJobTitle(application.jobId)}</p>
                      <p className="text-sm text-gray-600">{getJobLocation(application.jobId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Applied on</p>
                      <p className="text-sm text-gray-900">
                        {application.appliedAt.toLocaleDateString()} at {application.appliedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Status and Actions */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(application.status)}`}>
                      <span>{getStatusIcon(application.status)}</span>
                      <span>{application.status?.toUpperCase() || "PENDING"}</span>
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={application.status || "pending"}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="viewed">👁️ Viewed</option>
                      <option value="shortlisted">✅ Shortlisted</option>
                      <option value="rejected">❌ Rejected</option>
                      <option value="hired">🎉 Hired</option>
                    </select>
                    
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetailsModal(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Applicant Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedApplication(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedApplication.userName?.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedApplication.userName || "Anonymous"}</h3>
                  <p className="text-gray-600">{selectedApplication.userEmail}</p>
                  <p className="text-gray-600">{selectedApplication.userMobile || "No mobile number provided"}</p>
                </div>
              </div>
              
              {/* Application Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg mb-3">Application Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Job Applied For</p>
                    <p className="font-semibold">{getJobTitle(selectedApplication.jobId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p>{selectedApplication.appliedAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Status</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status?.toUpperCase() || "PENDING"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p>{selectedApplication.updatedAt?.toDate().toLocaleDateString() || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              {/* Resume Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg mb-3">Resume/CV</h4>
                {selectedApplication.resumeUrl ? (
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </a>
                ) : (
                  <p className="text-gray-500">No resume uploaded</p>
                )}
              </div>
              
              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg mb-3">Cover Letter</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              )}
              
              {/* Additional Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg mb-3">Additional Information</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Experience:</span> {selectedApplication.experience || "Not specified"}</p>
                  <p><span className="text-gray-500">Current Company:</span> {selectedApplication.currentCompany || "Not specified"}</p>
                  <p><span className="text-gray-500">Notice Period:</span> {selectedApplication.noticePeriod || "Not specified"}</p>
                  <p><span className="text-gray-500">Expected Salary:</span> {selectedApplication.expectedSalary || "Not specified"}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="border-t pt-6 flex gap-3">
                <select
                  value={selectedApplication.status || "pending"}
                  onChange={(e) => {
                    updateApplicationStatus(selectedApplication.id, e.target.value);
                    setSelectedApplication({...selectedApplication, status: e.target.value});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">⏳ Update Status</option>
                  <option value="viewed">👁️ Mark as Viewed</option>
                  <option value="shortlisted">✅ Shortlist</option>
                  <option value="rejected">❌ Reject</option>
                  <option value="hired">🎉 Mark as Hired</option>
                </select>
                
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedApplication.userEmail}`;
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function ApplicantsLoading() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

// Main export with Suspense boundary
export default function EmployerApplicantsPage() {
  return (
    <Suspense fallback={<ApplicantsLoading />}>
      <ApplicantsContent />
    </Suspense>
  );
}