'use client';

export default function BTNHero() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="flex items-center space-x-4">
          {/* Decorative Element */}
          <div className="flex space-x-1.5">
            <div className="w-2 h-16 bg-red-600"></div>
            <div className="w-2 h-16 bg-black"></div>
            <div className="w-2 h-16 bg-green-600"></div>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              Your Pulse on Black Innovation
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Celebrating Black excellence in technology, startups, and digital culture
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
