"use client";

export default function ClientsSection() {
  const companies = [
    "TCS",
    "Infosys",
    "Wipro",
    "HCL",
    "Tech Mahindra",
    "Accenture",
    "Capgemini",
    "Cognizant",
    "Amazon",
    "Flipkart",
    "Google",
    "Microsoft",
    "Paytm",
    "Zoho",
    "Byju's",
    "Deloitte",
    "EY",
    "KPMG",
    "IBM",
    "L&T"
  ];

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Our <span className="text-blue-600">Clients</span>
        </h2>

        <p className="text-gray-600 mb-12">
          Trusted by leading companies across industries.
        </p>

        {/* Slider */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-12 animate-scroll whitespace-nowrap">

            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="text-xl font-semibold text-gray-700 bg-gray-100 px-6 py-3 rounded-xl shadow-sm"
              >
                {company}
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* Animation Style */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}