"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [industries, setIndustries] = useState([]);
  const [companySizes, setCompanySizes] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // Fetch all companies from jobs (unique companies)
      const jobsSnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = jobsSnapshot.docs.map(doc => doc.data());
      
      // Extract unique companies
      const uniqueCompanies = [];
      const companyMap = new Map();
      
      jobsData.forEach(job => {
        if (job.company && !companyMap.has(job.company)) {
          companyMap.set(job.company, {
            name: job.company,
            location: job.location,
            industry: job.industry || "Technology",
            size: job.companySize || "50-200 employees",
            jobs: 1,
            logo: `/company-logos/${job.company.toLowerCase().replace(/\s/g, '-')}.png`,
            description: job.companyDescription || `${job.company} is a leading company in the ${job.industry || "tech"} industry.`,
            email: `careers@${job.company.toLowerCase().replace(/\s/g, '')}.com`,
            website: `https://www.${job.company.toLowerCase().replace(/\s/g, '')}.com`
          });
        } else if (job.company && companyMap.has(job.company)) {
          const existing = companyMap.get(job.company);
          existing.jobs += 1;
          companyMap.set(job.company, existing);
        }
      });
      
      const companiesList = Array.from(companyMap.values());
      setCompanies(companiesList);
      setFilteredCompanies(companiesList);
      
      // Extract unique industries and sizes
      const uniqueIndustries = [...new Set(companiesList.map(c => c.industry).filter(Boolean))];
      const uniqueSizes = [...new Set(companiesList.map(c => c.size).filter(Boolean))];
      setIndustries(uniqueIndustries);
      setCompanySizes(uniqueSizes);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setLoading(false);
    }
  };

  // Filter companies
  useEffect(() => {
    let filtered = companies;
    
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }
    
    if (selectedSize) {
      filtered = filtered.filter(company => company.size === selectedSize);
    }
    
    setFilteredCompanies(filtered);
  }, [searchTerm, selectedIndustry, selectedSize, companies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Top Companies Hiring Now
          </h1>
          <p className="text-xl text-center text-purple-100 mb-8">
            Discover amazing companies and find your dream job
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company name, industry, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 text-gray-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Industry Filter */}
              {industries.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Company Size Filter */}
              {companySizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Sizes</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Clear Filters */}
              {(selectedIndustry || selectedSize) && (
                <button
                  onClick={() => {
                    setSelectedIndustry("");
                    setSelectedSize("");
                    setSearchTerm("");
                  }}
                  className="text-purple-600 text-sm hover:text-purple-700"
                >
                  Clear all filters
                </button>
              )}
              
              {/* Company Count */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-purple-600">{filteredCompanies.length}</span> companies
                </p>
              </div>
            </div>
          </div>
          
          {/* Companies Grid */}
          <div className="flex-1">
            {filteredCompanies.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCompanies.map((company, index) => (
                  <Link href={`/companies/${company.name.toLowerCase().replace(/\s/g, '-')}`} key={index}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Placeholder */}
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {company.name.charAt(0)}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                              {company.name}
                            </h3>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm text-gray-600">{company.location || "Multiple locations"}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm text-gray-600">{company.size || "50-200 employees"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                          {company.description}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              {company.jobs} open position{company.jobs !== 1 ? 's' : ''}
                            </span>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                              {company.industry}
                            </span>
                          </div>
                          
                          <svg className="w-5 h-5 text-purple-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}