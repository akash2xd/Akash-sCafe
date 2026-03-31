import React from "react";
import { FaPlus, FaCheck } from "react-icons/fa6";

const AddOnModal = ({
  isOpen,
  onClose,
  item,
  addOn,
  onAddBasic,
  onAddWithAddOn,
}) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="glass-card shadow-2xl w-full max-w-md overflow-hidden relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/50 to-[#1a1510] p-6 text-center border-b border-[#d4a574]/[0.08]">
          <h2 className="text-2xl font-extrabold text-[#f0e6d8] font-heading">
            Level Up Your Pizza? 🍕
          </h2>
          <p className="text-[#b8a898] text-sm mt-1">
            Don't miss out on the cheesiness!
          </p>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">

          {/* Visual Representation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Pizza Image */}
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-full object-cover ring-2 ring-[#d4a574]/30 shadow-lg"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#231e17] text-xs px-2 py-0.5 rounded text-[#b8a898] border border-[#d4a574]/10 whitespace-nowrap">
                {item.title}
              </span>
            </div>

            <FaPlus className="text-[#8a7d72] text-xl" />

            {/* Cheese Addon Image */}
            <div className="relative">
              <img
                src={addOn.image}
                alt={addOn.title}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-400/40 shadow-lg"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-xs px-2 py-0.5 rounded text-[#0d0b08] font-bold whitespace-nowrap">
                +{addOn.price}
              </span>
            </div>
          </div>

          {/* Offer Text */}
          <div className="glass-surface p-4 w-full mb-6 text-center">
            <h3 className="text-lg font-bold text-[#f0e6d8] mb-1 font-heading">Add Extra Cheese</h3>
            <p className="text-[#b8a898] text-sm">{addOn.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onAddWithAddOn}
              className="w-full py-3.5 bg-gradient-to-r from-[#d4a574] to-[#c08552] text-[#0d0b08] rounded-xl font-bold text-lg shadow-lg shadow-[#d4a574]/20
                         hover:shadow-[#d4a574]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaCheck /> Yes, Add Cheese ({addOn.price})
            </button>

            <button
              onClick={onAddBasic}
              className="w-full py-3 bg-transparent text-[#b8a898] rounded-xl font-semibold text-base 
                         hover:bg-[#d4a574]/[0.06] hover:text-[#f0e6d8] transition-all cursor-pointer"
            >
              No, just the pizza
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnModal;