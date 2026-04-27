"use client"

export default function WebVideoPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/web1.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Your Ultimate <span className="text-yellow-400">Job Solution</span>
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl">
          Learn Skills. Build Confidence. Get Placed.
        </p>

        <button className="mt-10 px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl text-lg hover:bg-yellow-300 transition duration-300 shadow-xl">
          Explore Programs
        </button>

      </div>

    </div>
  )
}