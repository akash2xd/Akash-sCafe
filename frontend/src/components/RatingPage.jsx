import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const RatingPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const backendUrl = "http://localhost:5000";
      const res = await axios.get(`${backendUrl}/api/reviews`);
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const newReview = { name, rating, comment };
    try {
      const backendUrl = "http://localhost:5000";
      const res = await axios.post(`${backendUrl}/api/reviews`, newReview);
      setReviews([res.data, ...reviews]);
      setSubmitted(true);
      setRating(0);
      setName("");
      setComment("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error posting review:", err);
      setError("Failed to submit review. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#0d0b08] pt-24 pb-12 px-4 md:px-8 text-[#f0e6d8]">
      <motion.div
        initial="hidden" animate="visible" variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1
            className="text-5xl md:text-7xl mb-4 gradient-text"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Guest Book
          </h1>
          <p className="text-[#8a7d72] tracking-wider uppercase text-sm md:text-base">
            Share your experience with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT: Submission Form */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-8 h-fit"
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#f0e6d8] font-heading">Write a Review</h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#8a7d72] uppercase tracking-wide">Your Rating</label>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          type="button"
                          key={index}
                          className={`text-3xl transition-all duration-200 cursor-pointer ${starValue <= (hover || rating)
                            ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                            : "text-[#2e261d]"
                            }`}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHover(starValue)}
                          onMouseLeave={() => setHover(rating)}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#8a7d72] uppercase tracking-wide">Name</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-field" />
                </div>

                {/* Comment Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#8a7d72] uppercase tracking-wide">Review</label>
                  <textarea required rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about your meal..." className="input-field resize-none"></textarea>
                </div>

                {error && <p className="text-[#e85d75] text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="button-primary w-full cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-64 text-center space-y-4"
              >
                <div className="text-5xl">🎉</div>
                <h3 className="text-xl font-bold text-[#f0e6d8] font-heading">Thank You!</h3>
                <p className="text-[#b8a898]">Your review has been submitted successfully.</p>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT: Recent Reviews List */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-[#f0e6d8] px-2 font-heading">Recent Stories</h2>

            {loading ? (
              <p className="text-[#8a7d72] italic">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-[#8a7d72] italic">No reviews yet. Be the first!</p>
            ) : (
              <div className="grid gap-6 max-h-[800px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    whileHover={{ scale: 1.02 }}
                    className="glass-surface p-6 hover:border-[#d4a574]/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-[#f0e6d8] font-heading">{review.name}</h3>
                        <span className="text-xs text-[#8a7d72]">{formatDate(review.createdAt)}</span>
                      </div>
                      <div className="flex text-amber-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "opacity-100 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]" : "opacity-20"}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#b8a898] italic">"{review.comment}"</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RatingPage;