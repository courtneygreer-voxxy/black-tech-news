'use client';

export default function BTNHero() {
  return (
    <section className="bg-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
        <div className="max-w-4xl">
          {/* Decorative Element */}
          <div className="flex space-x-2 mb-8">
            <div className="w-4 h-20 bg-red-600"></div>
            <div className="w-4 h-20 bg-black"></div>
            <div className="w-4 h-20 bg-green-600"></div>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight mb-6">
            Elevating Black
            <br />
            Excellence in Tech
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Curated technology news focused on Black professionals, startups,
            and innovation. Stay informed about the leaders shaping the future
            of technology.
          </p>
        </div>
      </div>
    </section>
  );
}
