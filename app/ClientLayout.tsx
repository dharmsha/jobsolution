"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />

      <main className="flex-1 pt-20 px-6">
        {children}
      </main>

      <Footer />
    </AuthProvider>
  );
}