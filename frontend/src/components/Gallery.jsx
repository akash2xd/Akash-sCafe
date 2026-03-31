import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaX } from "react-icons/fa6";
import Loader from "./Loader";

// AI-generated images
import ambience1 from "../assets/gallery/ambience1_ai.png";
import ambience2 from "../assets/gallery/ambience2_ai.png";
import Cake1 from "../assets/gallery/cake1_ai.png";
import Cake2 from "../assets/gallery/cake2_ai.png";
import cake3 from "../assets/gallery/cake3_ai.png";
import cake4 from "../assets/gallery/cake4_ai.png";
import cake5 from "../assets/gallery/cake5_ai.png";
import cake6 from "../assets/gallery/cake6_ai.png";
import cake7 from "../assets/gallery/cake7_ai.png";
import cake8 from "../assets/gallery/cake8_ai.png";
import cake9 from "../assets/gallery/cake9_ai.png";
import cake10 from "../assets/gallery/cake10_ai.png";
import cake11 from "../assets/gallery/cake11_ai.png";
import cake12 from "../assets/gallery/cake12_ai.png";
import cake13 from "../assets/gallery/cake13_ai.png";
import cake14 from "../assets/gallery/cake14_ai.png";
import coffee1 from "../assets/gallery/coffee1_ai.png";
import customer1 from "../assets/gallery/customer1_ai.png";
import customer2 from "../assets/gallery/customer2_ai.png";
import customer3 from "../assets/gallery/customer3_ai.png";
import customer4 from "../assets/gallery/customer4_ai.png";
import customer5 from "../assets/gallery/customer5_ai.png";
import customer6 from "../assets/gallery/customer6_ai.png";
import FishAndChips from "../assets/gallery/fish-and-chips_ai.png";
import food1 from "../assets/gallery/food1_ai.png";
import pastry1 from "../assets/gallery/pastry1_ai.png";

const allImages = [
  ambience1, ambience2, Cake1, Cake2, cake3, cake4, cake5, cake6, cake7,
  cake8, cake9, cake10, cake11, cake12, cake13, cake14, coffee1, customer1,
  customer2, customer3, customer4, customer5, customer6, FishAndChips, food1, pastry1,
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <section className="pt-28 pb-20 container mx-auto px-4 min-h-screen">
        <motion.h2
          className="mb-12 text-center text-5xl font-extrabold tracking-tight text-[#f0e6d8] drop-shadow-lg font-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Our Gallery
        </motion.h2>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shuffledImages.map((src, index) => (
            <motion.div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg cursor-pointer group relative ring-1 ring-[#d4a574]/5 hover:ring-[#d4a574]/30 transition-all duration-300"
              onClick={() => setSelectedImage(src)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <img
                src={src}
                alt={`Gallery ${index}`}
                className="w-full aspect-square object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-6 right-6 text-[#b8a898] hover:text-[#d4a574] text-3xl transition-colors cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              <FaX />
            </button>

            <motion.img
              src={selectedImage}
              alt="Selected"
              className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-xl object-contain ring-1 ring-[#d4a574]/10"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
