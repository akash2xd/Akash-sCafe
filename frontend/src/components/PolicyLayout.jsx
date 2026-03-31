// src/components/PolicyLayout.jsx
import React from "react";

const PolicyLayout = ({ title, children }) => {
  return (
    <div className="min-h-[60vh] pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-[#0d0b08]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 gradient-text text-center font-heading">{title}</h2>
        <div className="glass-card p-6 sm:p-10 text-[#b8a898] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;