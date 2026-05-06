"use client";

import { useState, Suspense } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        setError("User profile not found!");
        return;
      }

      const userData = userDoc.data();
      if (userData.role !== role) {
        setError(`Access Denied: You are registered as ${userData.role}`);
        await auth.signOut();
        return;
      }

      document.cookie = `firebaseAuthToken=${await user.getIdToken()}; path=/`;
      router.push(role === "jobseeker" ? "/dashboard/jobseeker" : "/dashboard/employer");

    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
      <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm font-medium">Please enter your details to login</p>
          {message && <p className="mt-4 text-green-400 text-xs font-bold py-2 bg-green-500/10 border border-green-500/20 rounded-lg animate-pulse">{message}</p>}
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Login as:</label>
            <div className="flex p-1 bg-black rounded-xl border border-white/5 gap-1">
              <button type="button" onClick={() => setRole("jobseeker")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role === "jobseeker" ? "bg-blue-600 text-white" : "text-gray-500"}`}>Job Seeker</button>
              <button type="button" onClick={() => setRole("employer")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role === "employer" ? "bg-purple-600 text-white" : "text-gray-500"}`}>Employer</button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
            <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
            <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" required />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition active:scale-95 shadow-lg">
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">Don't have an account? <Link href="/signup" className="text-white font-bold hover:text-blue-400 underline-offset-4">Sign up here</Link></p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303]" />}>
      <LoginContent />
    </Suspense>
  );
}