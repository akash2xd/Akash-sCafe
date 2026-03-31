// src/components/ToastContainer.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { FaX } from "react-icons/fa6";

const ToastContainer = () => {
  const { toasts, removeToast } = useCart();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-4 w-80 max-w-sm p-4
                     glass-card text-white shadow-2xl shadow-black/30
                     animate-slideIn"
          style={{
            borderLeft: '3px solid #d4a574',
          }}
        >
          <img
            src={toast.image}
            alt={toast.title}
            className="h-16 w-16 rounded-lg object-cover shadow-md ring-1 ring-[#d4a574]/10"
          />
          <div className="flex-grow overflow-hidden">
            <p className="font-semibold text-[#d4a574] text-sm">Added to Cart!</p>
            <p className="font-bold text-[#f0e6d8] truncate">{toast.title}</p>
            <p className="text-sm text-[#b8a898]">{toast.price}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8a7d72] hover:text-white transition-colors self-start cursor-pointer"
          >
            <FaX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;