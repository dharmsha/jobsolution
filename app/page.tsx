// app/page.js
// import Sidebar from "@/components/Sidebar";

import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Apply from "@/app/components/Apply";
import ClientsSection from "@/app/components/ClientsSection";
export default function Home() {
  return (
    <>
    
     <Hero />
     <Features />
     <Apply />
     <ClientsSection />
    </>
  );
}