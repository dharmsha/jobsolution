"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Menu, X } from "lucide-react";

export default function EmployerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login?role=employer");
      } else {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setCompanyName(userDoc.data().companyName || "Company");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login?role=employer");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard/employer" },
    { name: "Post Job", path: "/dashboard/employer/post-job" },
    { name: "My Jobs", path: "/dashboard/employer/jobs" },
    { name: "Applicants", path: "/dashboard/employer/applicants" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-purple-600">
            Employer Panel
          </h2>
          <p className="text-sm text-gray-600 mt-2">{companyName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg transition font-medium
                ${
                  pathname === item.path
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
          <h1 className="font-semibold text-gray-700">
            {companyName}
          </h1>
          <button onClick={handleLogout} className="text-red-500 text-sm">
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-10">
          {children}
        </main>

      </div>
    </div>
  );
}