// src/components/Merchandise.jsx
import React from 'react';
import { FaLock, FaClock } from 'react-icons/fa';

const MERCH_ITEMS = [
  { id: 1, name: "AKASH's Signature Tee", price: "₹799", image: "https://placehold.co/400x400/231e17/d4a574?text=Signature+Tee", tag: "Apparel" },
  { id: 2, name: "Classic Ceramic Mug", price: "₹399", image: "https://placehold.co/400x400/231e17/d4a574?text=Ceramic+Mug", tag: "Accessories" },
  { id: 3, name: "Barista Apron (Black)", price: "₹899", image: "https://placehold.co/400x400/231e17/d4a574?text=Barista+Apron", tag: "Professional" },
  { id: 4, name: "AKASH's Tote Bag", price: "₹299", image: "https://placehold.co/400x400/231e17/d4a574?text=Tote+Bag", tag: "Essentials" },
  { id: 5, name: "Thermal Travel Cup", price: "₹599", image: "https://placehold.co/400x400/231e17/d4a574?text=Travel+Cup", tag: "Accessories" },
];

const Merchandise = () => {
  return (
    <div className="min-h-screen bg-[#0d0b08] pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#0d0b08] to-[#0d0b08] pointer-events-none"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 animate-fadeInUp">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 font-heading">
          AKASH's Merch
        </h1>
        <p className="text-[#b8a898] text-lg">
          Take a piece of the AKASH's Cafe experience home with you. High-quality apparel and accessories.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {MERCH_ITEMS.map((item) => (
          <div
            key={item.id}
            className="group relative glass-card overflow-hidden hover:border-[#d4a574]/20 transition-all duration-300"
          >
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-[#0d0b08]/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
              <FaLock className="text-3xl text-[#d4a574] mb-2" />
              <span className="text-[#f0e6d8] font-bold tracking-widest uppercase text-sm font-heading">Dropping Soon</span>
            </div>

            {/* Badge */}
            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#d4a574] to-[#c08552] text-[#0d0b08] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Coming Soon
            </div>

            {/* Image */}
            <div className="h-64 w-full overflow-hidden bg-[#1a1510] rounded-t-2xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-60"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-[#f0e6d8] group-hover:text-[#d4a574] transition-colors font-heading">{item.name}</h3>
                <span className="text-[#8a7d72] text-sm border border-[#d4a574]/[0.08] px-2 py-0.5 rounded">{item.tag}</span>
              </div>
              <div className="flex justify-between items-end mt-4">
                <span className="text-2xl font-bold text-[#8a7d72] blur-[2px] select-none">{item.price}</span>
                <button disabled className="px-4 py-2 glass-surface text-[#8a7d72] text-sm font-semibold cursor-not-allowed">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder */}
        <div className="hidden lg:flex items-center justify-center border-2 border-dashed border-[#d4a574]/[0.08] rounded-2xl p-8 text-[#8a7d72]">
          <div className="text-center">
            <FaClock className="text-4xl mx-auto mb-2 opacity-50" />
            <p>More items loading...</p>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-20 text-center relative z-10">
        <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-[#d4a574] to-[#c08552]">
          <div className="bg-[#0d0b08] rounded-full px-8 py-4">
            <p className="text-[#f0e6d8] font-semibold">
              🔥 Exclusive Launch Offers for early subscribers. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandise;