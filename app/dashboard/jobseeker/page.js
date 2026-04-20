"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  doc, 
  getDoc,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { 
  User, 
  Briefcase, 
  FileText, 
  LogOut, 
  Upload, 
  Edit2, 
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Award,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  Menu
} from "lucide-react";

export default function JobseekerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    experience: "",
    skills: "",
    resumeUrl: "",
    resumeName: ""
  });
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login?role=jobseeker");
      } else {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
        await fetchJobs();
        await fetchAppliedJobs(currentUser.uid);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "jobs"));
      const jobsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt?.toDate() || new Date()
      }));
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchAppliedJobs = async (uid) => {
    try {
      const q = query(collection(db, "applications"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const appliedList = snapshot.docs.map(doc => ({
        id: doc.id,
        jobId: doc.data().jobId,
        status: doc.data().status || "pending",
        appliedAt: doc.data().appliedAt?.toDate() || new Date()
      }));
      setAppliedJobs(appliedList);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload PDF or DOC/DOCX file only!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB!");
      return;
    }
    
    setUploading(true);
    try {
      const timestamp = Date.now();
      const filename = `resumes/${user.uid}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        resumeUrl: downloadURL,
        resumeName: file.name,
        updatedAt: new Date()
      });
      setUserData({ ...userData, resumeUrl: downloadURL, resumeName: file.name });
      alert("Resume uploaded successfully!");
    } catch (error) {
      alert("Error uploading resume: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name: userData.name,
        mobile: userData.mobile,
        location: userData.location,
        experience: userData.experience,
        skills: userData.skills,
        updatedAt: new Date()
      });
      alert("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  const handleApply = async (job) => {
    if (!userData.resumeUrl) {
      alert("Please upload your resume before applying for jobs!");
      setActiveTab("profile");
      return;
    }
    if (appliedJobs.some(app => app.jobId === job.id)) {
      alert("You have already applied for this job!");
      return;
    }
    setShowApplyModal(job);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await addDoc(collection(db, "applications"), {
        jobId: showApplyModal.id,
        jobTitle: showApplyModal.title,
        companyName: showApplyModal.company,
        userId: user.uid,
        userName: userData.name || user.displayName,
        userEmail: user.email,
        userMobile: userData.mobile,
        resumeUrl: userData.resumeUrl,
        coverLetter: coverLetter,
        appliedAt: new Date(),
        status: "pending"
      });
      alert("Application Submitted Successfully!");
      setShowApplyModal(null);
      setCoverLetter("");
      await fetchAppliedJobs(user.uid);
    } catch (error) {
      alert("Error submitting application: " + error.message);
    } finally {
      setApplying(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login?role=jobseeker");
  };

  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case "shortlisted": return { color: "bg-green-500", icon: Award, text: "Shortlisted", bg: "bg-green-50 text-green-700" };
      case "rejected": return { color: "bg-red-500", icon: XCircle, text: "Rejected", bg: "bg-red-50 text-red-700" };
      case "viewed": return { color: "bg-blue-500", icon: Eye, text: "Viewed", bg: "bg-blue-50 text-blue-700" };
      case "hired": return { color: "bg-purple-500", icon: CheckCircle, text: "Hired", bg: "bg-purple-50 text-purple-700" };
      default: return { color: "bg-yellow-500", icon: Clock, text: "Pending", bg: "bg-yellow-50 text-yellow-700" };
    }
  };

  const stats = [
    { label: "Total Applied", value: appliedJobs.length, icon: Briefcase, color: "bg-blue-500" },
    { label: "Shortlisted", value: appliedJobs.filter(j => j.status === "shortlisted").length, icon: Award, color: "bg-green-500" },
    { label: "In Review", value: appliedJobs.filter(j => j.status === "pending" || j.status === "viewed").length, icon: Clock, color: "bg-yellow-500" },
    { label: "Profile Views", value: "124", icon: Eye, color: "bg-purple-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition"
        >
          {mobileMenuOpen ? <XCircle className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-6 pb-4 border-b">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-white font-bold">{userData.name?.charAt(0) || "U"}</span>
              </div>
              <h3 className="text-center font-semibold mt-2">{userData.name || "User"}</h3>
              <p className="text-center text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="space-y-2">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "jobs", label: "Jobs", icon: Briefcase },
                { id: "applications", label: "Applications", icon: FileText },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobSeeker Dashboard
              </h1>
              <p className="text-xs md:text-sm text-gray-500">Welcome back, {userData.name?.split(" ")[0] || "User"} 👋</p>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Warning */}
      {!userData.resumeUrl && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800">Please upload your resume to apply for jobs!</span>
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition"
              >
                Upload Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="hidden md:flex gap-2 border-b">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "jobs", label: "Browse Jobs", icon: Briefcase, count: jobs.length },
            { id: "applications", label: "Applications", icon: FileText, count: appliedJobs.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition relative ${
                activeTab === tab.id ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full ml-1">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              {/* Avatar */}
              <div className="px-6 relative">
                <div className="w-24 h-24 bg-white rounded-full p-1 -mt-12 shadow-lg mx-auto md:mx-0">
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">{userData.name?.charAt(0) || "U"}</span>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleUpdateProfile} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">Save</button>
                      <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold">{userData.name || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="font-semibold">{userData.mobile || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold">{userData.location || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-semibold">{userData.experience || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {userData.skills?.split(",").map((skill, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{skill.trim()}</span>
                          )) || "Not set"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className="w-full p-3 border rounded-lg" />
                    <input type="tel" placeholder="Mobile Number" value={userData.mobile} onChange={e => setUserData({...userData, mobile: e.target.value})} className="w-full p-3 border rounded-lg" />
                    <input type="text" placeholder="Location" value={userData.location} onChange={e => setUserData({...userData, location: e.target.value})} className="w-full p-3 border rounded-lg" />
                    <select value={userData.experience} onChange={e => setUserData({...userData, experience: e.target.value})} className="w-full p-3 border rounded-lg">
                      <option value="">Select Experience</option>
                      <option>Fresher</option><option>1-2 years</option><option>3-5 years</option><option>5-8 years</option><option>8+ years</option>
                    </select>
                    <textarea placeholder="Skills (comma separated)" value={userData.skills} onChange={e => setUserData({...userData, skills: e.target.value})} className="w-full p-3 border rounded-lg" rows="2" />
                  </div>
                )}

                {/* Resume Section */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold text-lg mb-4">📄 Resume</h3>
                  <div className={`rounded-xl p-6 text-center ${userData.resumeUrl ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    {userData.resumeUrl ? (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <p className="font-semibold">{userData.resumeName}</p>
                        <a href={userData.resumeUrl} target="_blank" className="text-blue-600 text-sm hover:underline inline-block mt-2">View Resume</a>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                        <p className="font-semibold">No resume uploaded</p>
                        <p className="text-sm text-gray-500">Upload your resume to apply for jobs</p>
                      </>
                    )}
                    <div className="mt-4">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files[0] && handleResumeUpload(e.target.files[0])} className="hidden" id="resumeUpload" />
                      <label htmlFor="resumeUpload" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        {uploading ? "Uploading..." : (userData.resumeUrl ? "Update Resume" : "Upload Resume")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No jobs available at the moment.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const hasApplied = appliedJobs.some(app => app.jobId === job.id);
                return (
                  <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 mt-1">{job.company}</p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          {job.location && <span className="flex items-center gap-1 text-sm text-gray-500"><MapPin className="w-3 h-3" />{job.location}</span>}
                          {job.salary && <span className="flex items-center gap-1 text-sm text-green-600"><DollarSign className="w-3 h-3" />{job.salary}</span>}
                          {job.jobType && <span className="flex items-center gap-1 text-sm text-gray-500"><Briefcase className="w-3 h-3" />{job.jobType}</span>}
                        </div>
                        <p className="mt-3 text-gray-600 text-sm line-clamp-2">{job.description}</p>
                        <p className="mt-2 text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Posted {Math.ceil((new Date() - job.postedAt) / (1000 * 60 * 60 * 24))} days ago</p>
                      </div>
                      <button
                        onClick={() => handleApply(job)}
                        disabled={hasApplied}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${
                          hasApplied ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {hasApplied ? "Applied ✓" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {appliedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't applied for any jobs yet.</p>
                <button onClick={() => setActiveTab("jobs")} className="mt-4 text-blue-600 hover:underline">Browse Jobs →</button>
              </div>
            ) : (
              appliedJobs.map((application) => {
                const job = jobs.find(j => j.id === application.jobId);
                const statusConfig = getStatusConfig(application.status);
                return (
                  <div key={application.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900">{job?.title || "Unknown Job"}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg}`}>{statusConfig.text}</span>
                        </div>
                        <p className="text-gray-600">{job?.company}</p>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" />Applied on {application.appliedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowApplyModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold">Apply for {showApplyModal.title}</h2>
              <button onClick={() => setShowApplyModal(null)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className={`p-4 rounded-xl ${userData.resumeUrl ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-semibold mb-2">Your Resume</p>
                {userData.resumeUrl ? (
                  <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /><span>{userData.resumeName}</span><a href={userData.resumeUrl} target="_blank" className="text-blue-600 text-sm">View</a></div>
                ) : (
                  <p className="text-red-600">⚠️ No resume uploaded</p>
                )}
              </div>
              <div>
                <label className="font-semibold mb-2 block">Cover Letter (Optional)</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="w-full p-3 border rounded-xl" rows="5" placeholder="Why are you a good fit for this role?" />
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setShowApplyModal(null)} className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
                <button onClick={submitApplication} disabled={!userData.resumeUrl || applying} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-400">
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}