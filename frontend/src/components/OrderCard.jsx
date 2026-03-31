// src/components/OrderCard.jsx
import React, { useState } from 'react';

const getStatusInfo = (status) => {
  switch (status) {
    case 'Pending':
      return { text: 'Waiting for confirmation...', color: 'text-amber-400', bgColor: 'bg-amber-400/10 border-amber-400/20' };
    case 'Confirmed':
      return { text: 'Your order is confirmed.', color: 'text-blue-400', bgColor: 'bg-blue-400/10 border-blue-400/20' };
    case 'Preparing':
      return { text: 'The kitchen is preparing your food.', color: 'text-orange-400', bgColor: 'bg-orange-400/10 border-orange-400/20' };
    case 'Out for Delivery':
      return { text: 'On its way to you!', color: 'text-[#d4a574]', bgColor: 'bg-[#d4a574]/10 border-[#d4a574]/20' };
    case 'Delivered':
      return { text: 'Delivered. Enjoy your meal!', color: 'text-green-500', bgColor: 'bg-green-500/10 border-green-500/20' };
    case 'Cancelled':
      return { text: 'Order cancelled.', color: 'text-[#e85d75]', bgColor: 'bg-[#e85d75]/10 border-[#e85d75]/20' };
    default:
      return { text: status, color: 'text-[#b8a898]', bgColor: 'bg-[#b8a898]/10 border-[#b8a898]/20' };
  }
};

const OrderCard = ({ order, onCancelOrder }) => {
  const statusInfo = getStatusInfo(order.status);
  const [cancelling, setCancelling] = useState(false);

  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleCancelClick = async () => {
    if (!window.confirm("Are you sure you want to cancel? This will initiate a full refund.")) return;
    setCancelling(true);
    if (onCancelOrder) await onCancelOrder(order._id);
    setCancelling(false);
  };

  return (
    <div className="glass-card p-6 text-[#f0e6d8]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#d4a574]/[0.08] pb-4 mb-4 gap-2">
        <div>
          <h2 className="text-2xl font-bold font-heading">Order #{order._id.slice(-6)}</h2>
          <p className="text-sm text-[#8a7d72]">{orderDate}</p>
        </div>
        <div className={`text-right px-3 py-1.5 rounded-lg border ${statusInfo.bgColor}`}>
          <p className={`text-sm font-bold ${statusInfo.color}`}>
            {statusInfo.text}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 font-heading text-[#f0e6d8]">Items</h3>
        {order.items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex justify-between text-[#b8a898] py-1">
            <span>{item.quantity} x {item.title}</span>
            <span className="text-[#f0e6d8]">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#d4a574]/[0.08] pt-4">
        <p className="text-sm font-semibold mb-1 text-[#b8a898]">Delivery To:</p>
        <p className="text-[#8a7d72] text-sm">{order.deliveryAddress}</p>

        <div className="flex justify-between items-end mt-4">
          <div className="text-xl font-bold font-heading">
            <span className="text-[#b8a898]">Total: </span>
            <span className="gradient-text">₹{order.totalAmount}</span>
          </div>

          {order.status === 'Pending' && (
            <button
              onClick={handleCancelClick}
              disabled={cancelling}
              className="bg-[#e85d75]/10 hover:bg-[#e85d75] text-[#e85d75] hover:text-white text-sm font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cancelling ? "Processing..." : "Cancel Order"}
            </button>
          )}
        </div>

        {order.status === 'Cancelled' && (
          <div className="mt-4 bg-[#e85d75]/5 border border-[#e85d75]/20 p-3 rounded-lg text-center text-[#e85d75]/80 text-sm">
            This order was cancelled. Refund has been initiated.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;