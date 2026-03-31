import React from "react";

const Loader = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d0b08]/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5">
        {/* Animated spinning ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#d4a574]/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4a574] border-r-[#c08552] animate-spin" />
          <div className="absolute inset-2 rounded-full bg-[#d4a574]/5" />
        </div>
        <p className="text-base font-medium text-[#f0e6d8] animate-pulse tracking-wide font-heading">
          {message || "Loading AKASH's Cafe..."}
        </p>
      </div>
    </div>
  );
};

export default Loader;