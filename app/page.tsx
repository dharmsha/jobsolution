// app/page.js
// import Sidebar from "@/components/Sidebar";
import Web from "@/app/components/Web"
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Apply from "@/app/components/Apply";
import ClientsSection from "@/app/components/ClientsSection";
export default function Home() {
  return (
    <>
    <Web />
     <Hero />
     <Features />
     <Apply />
     <ClientsSection />
    </>
  );
}