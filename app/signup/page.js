"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
    mobile: "",
    companyName: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (formData.role === "employer" && !formData.companyName) {
      setError("Company name is required for employer");
      setLoading(false);
      return;
    }

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // Save user data
      const userData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        mobile: formData.mobile,
        createdAt: new Date(),
        ...(formData.role === "employer" && { companyName: formData.companyName })
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // Set cookie
      document.cookie = `firebaseAuthToken=${await user.getIdToken()}; path=/`;

      // Redirect to respective dashboard
      if (formData.role === "jobseeker") {
        router.push("/dashboard/jobseeker");
      } else {
        router.push("/dashboard/employer");
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 selection:bg-blue-500/30">
      {/* Background Decorative Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-md my-10">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white tracking-tight">
          Join <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Us</span>
        </h1>
        <p className="text-gray-400 text-center mb-8 font-medium text-sm">Create your professional account</p>
        
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 ml-1 text-center">I am a:</label>
            <div className="flex p-1.5 bg-black/50 rounded-2xl border border-white/5 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "jobseeker", companyName: ""})}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  formData.role === "jobseeker" 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "employer"})}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  formData.role === "employer" 
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Mobile Number</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
              placeholder="+91 00000 00000"
              required
            />
          </div>

          {formData.role === "employer" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-inner"
                placeholder="Google Inc."
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Confirm</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-bold hover:text-blue-400 transition-colors underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}