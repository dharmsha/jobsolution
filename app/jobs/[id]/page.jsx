"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const docRef = doc(db, "jobs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setJob({
          id: docSnap.id,
          ...docSnap.data(),
          postedAt: docSnap.data().postedAt?.toDate() || new Date(),
        });
      } else {
        router.push("/jobs");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Top Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {job.title}
          </h1>

          <p className="text-gray-500 mb-4">{job.company}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            {job.location && <span>📍 {job.location}</span>}
            {job.jobType && <span>🕒 {job.jobType}</span>}
            {job.experience && <span>💼 {job.experience}</span>}
            {job.salary && (
              <span className="text-green-600 font-semibold">
                💰 {job.salary}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              const user = JSON.parse(localStorage.getItem("user") || "{}");
              if (!user?.uid) {
                router.push("/login?role=jobseeker");
              } else {
                alert("Application Submitted Successfully 🚀");
              }
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Apply Now
          </button>
        </div>

        {/* Job Description Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Skills Section */}
        {job.skills && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {job.skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}