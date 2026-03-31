import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { PIZZA_ADD_ON } from "../constants";
import AddOnModal from "./AddOnModal";

const DishCard = ({ dish }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAvailable = dish?.isInStock;

  const checkLoginAndRedirect = () => {
    if (!user) {
      navigate('/auth', { state: { from: location } });
      return false;
    }
    return true;
  };

  const handleOrderClick = () => {
    if (!checkLoginAndRedirect()) return;

    const isPizza =
      (dish.category === "Pizza") ||
      (dish.title && dish.title.toLowerCase().includes("pizza"));

    if (isPizza) {
      setIsModalOpen(true);
    } else {
      addToCart(dish);
    }
  };

  const handleAddBasic = () => {
    if (!checkLoginAndRedirect()) return;
    addToCart(dish);
    setIsModalOpen(false);
  };

  const handleAddWithAddOn = () => {
    if (!checkLoginAndRedirect()) return;
    addToCart(dish);
    addToCart({
      ...PIZZA_ADD_ON,
      title: `Extra Cheese (${dish.title})`,
      image: PIZZA_ADD_ON.image,
      price: PIZZA_ADD_ON.price
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`
          group rounded-3xl shadow-xl p-6 flex flex-col items-center min-h-[400px]
          glass-card
          transition-all duration-300 ease-out 
          hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#d4a574]/5
          glow-warm-hover
          ${!isAvailable ? 'opacity-50 grayscale' : ''} 
        `}
      >
        <div className="h-40 w-40 mb-6 rounded-2xl shadow-md overflow-hidden relative ring-1 ring-[#d4a574]/5 group-hover:ring-[#d4a574]/20 transition-all duration-300">
          <img
            src={dish.image}
            alt={dish.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x400/231e17/8a7d72?text=Image+Missing';
            }}
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-[#0d0b08]/70 flex items-center justify-center">
              <span className="text-white font-bold border border-white/30 px-3 py-1 rounded-lg text-sm tracking-wider">SOLD OUT</span>
            </div>
          )}
        </div>

        <h3 className="mb-2 text-2xl font-bold text-[#f0e6d8] text-center leading-tight font-heading">
          {dish.title}
        </h3>

        <p className="mb-4 text-base text-[#b8a898] text-center flex-grow line-clamp-3">
          {dish.description}
        </p>

        <span className="mb-6 text-2xl font-extrabold text-[#d4a574] block">
          {dish.price?.toString().includes('₹') ? dish.price : `₹${dish.price}`}
        </span>

        <div className="relative w-full flex justify-center mt-auto">
          <button
            className={`
              px-8 py-3 rounded-full font-bold text-lg shadow-lg 
              transition-all duration-300 ease-out
              ${isAvailable
                ? 'bg-gradient-to-r from-[#d4a574] to-[#c08552] text-[#0d0b08] hover:shadow-[#d4a574]/30 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-[#2e261d] text-[#8a7d72] cursor-not-allowed'
              }
            `}
            onClick={handleOrderClick}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Add to cart' : 'Sold Out'}
          </button>
        </div>
      </div>

      <AddOnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={dish}
        addOn={PIZZA_ADD_ON}
        onAddBasic={handleAddBasic}
        onAddWithAddOn={handleAddWithAddOn}
      />
    </>
  );
};

export default DishCard;