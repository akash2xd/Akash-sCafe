// src/components/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import OrderCard from "./OrderCard";

const API_URL = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return;

    const handleStatusUpdate = (payload) => {
      const updatedOrder = payload?.order || payload;
      if (!updatedOrder || !updatedOrder._id) return;

      setOrders((prev) => {
        const idx = prev.findIndex((o) => o._id === updatedOrder._id);
        if (idx === -1) return [updatedOrder, ...prev];
        return prev.map((o) => o._id === updatedOrder._id ? updatedOrder : o);
      });
    };

    socket.on("orderStatusUpdate", handleStatusUpdate);
    return () => socket.off("orderStatusUpdate", handleStatusUpdate);
  }, [socket]);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: "User requested cancellation" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel");
      alert("Order cancelled successfully. Refund initiated.");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 text-center text-[#f0e6d8]">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-[#d4a574] border-t-transparent rounded-full mb-4"></div>
        <p className="text-[#b8a898]">Loading your orders...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md w-full glow-warm-sm">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-[#f0e6d8] mb-4 font-heading">Login Required</h2>
          <p className="text-[#b8a898] mb-8">
            Please log in to access your order history and track your deliveries.
          </p>
          <Link to="/auth" className="button-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen pt-32 pb-20 px-4">
      <h1 className="text-4xl font-extrabold text-center text-[#f0e6d8] mb-12 font-heading">
        My Orders
      </h1>
      <div className="max-w-3xl mx-auto space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 glass-card border-dashed">
            <p className="text-[#b8a898] text-xl">
              You haven't placed any orders yet.
            </p>
            <Link to="/dishes" className="text-[#d4a574] hover:underline mt-4 inline-block">
              Browse Menu
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onCancelOrder={handleCancelOrder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
