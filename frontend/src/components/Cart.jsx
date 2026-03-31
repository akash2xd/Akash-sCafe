// src/components/Cart.jsx
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LocationPicker from "./LocationPicker";
import Loader from "./Loader";

const API_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Helper to load Razorpay SDK
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    getCartTotal,
    addToCart,
    decreaseCartQuantity,
    clearCart,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // --- LOADING STATE ---
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading your cart...");

  // --- ORDER TYPE STATE ---
  const [orderType, setOrderType] = useState('Delivery');
  const [tableNumber, setTableNumber] = useState('');

  // --- MODAL STATE ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- TOTAL CALCULATION LOGIC ---
  const subtotal = getCartTotal();
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryCharge = (orderType === 'Delivery' && subtotal < 500) ? 20 : 0;
  const totalWithGst = subtotal + gstAmount + deliveryCharge;

  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setLoading(false);
    }
  }, []);

  // --- MAP & LOCATION STATE ---
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);

  // --- ADDRESS STATE ---
  const [address, setAddress] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.mobile || "",
  });

  const handleLocationSelect = (coords, inRange, addressDetails) => {
    setDeliveryCoords(coords);
    setIsWithinRange(inRange);

    if (addressDetails) {
      setAddress((prev) => ({
        ...prev,
        street: addressDetails.formatted_address || prev.street,
        city: addressDetails.city || prev.city,
        state: addressDetails.state || prev.state,
        pincode: addressDetails.pincode || "",
      }));
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const hasSoldOutItem = cartItems.some((item) => !item.isInStock);

  const isAddressComplete =
    address.houseNo.trim() !== "" &&
    address.street.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim() !== "" &&
    address.pincode.trim() !== "" &&
    address.phone.trim() !== "";

  // --- CHECKOUT FLOW ---
  const handleCheckout = async () => {
    if (!isAuthenticated) return navigate("/auth");
    if (hasSoldOutItem) return alert("Please remove sold-out items.");

    if (orderType === 'Dine-in' && !tableNumber) return alert("Please enter your Table Number.");

    if (orderType === 'Delivery') {
      if (!isWithinRange) return alert("Your location is outside our delivery range.");
      if (!isAddressComplete) return alert("Please fill in all required address fields.");
      setShowPaymentModal(true);
      return;
    }

    processDineInOrder();
  };

  const processDineInOrder = async () => {
    setLoadingText("Placing Order...");
    setLoading(true);
    const currentToken = localStorage.getItem('klubnikaToken');

    try {
      const res = await fetch(`${API_URL}/payment/create-cash-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          orderType: 'Dine-in',
          tableNumber: tableNumber,
          cartItems: cartItems,
          amount: totalWithGst
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          alert("Order Placed Successfully! Please pay at the counter.");
          clearCart();
          navigate("/my-orders");
        }, 100);
      } else {
        throw new Error(data.error || "Failed to place order.");
      }
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    setShowPaymentModal(false);
    setLoadingText("Placing Order...");
    setLoading(true);

    const currentToken = localStorage.getItem('klubnikaToken');

    const formattedAddress = `
        ${address.houseNo}, ${address.street}
        ${address.landmark ? "Landmark: " + address.landmark : ""}
        ${address.city}, ${address.state} - ${address.pincode}
        Phone: ${address.phone}
    `.trim();

    try {
      const res = await fetch(`${API_URL}/payment/create-cash-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          orderType: 'Delivery',
          deliveryAddress: formattedAddress,
          deliveryCoords: deliveryCoords,
          paymentMethod: 'Cash on Delivery',
          cartItems: cartItems,
          amount: totalWithGst
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          alert("Order Placed Successfully! Please pay cash on delivery.");
          clearCart();
          navigate("/my-orders");
        }, 100);
      } else {
        throw new Error(data.error || "Failed to place COD order.");
      }
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setShowPaymentModal(false);
    setLoadingText("Initializing Payment Gateway...");
    setLoading(true);

    const currentToken = localStorage.getItem('klubnikaToken');

    try {
      const formattedAddress = `
          ${address.houseNo}, ${address.street}
          ${address.landmark ? "Landmark: " + address.landmark : ""}
          ${address.city}, ${address.state} - ${address.pincode}
          Phone: ${address.phone}
        `.trim();

      const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) throw new Error("Failed to load payment gateway.");

      const orderRes = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          amount: totalWithGst,
          orderType: 'Delivery'
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || "Failed to create order");
      }
      const order = await orderRes.json();

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AKASH's Cafe",
        description: "Food & Beverage Order",
        order_id: order.id,

        handler: async function (response) {
          try {
            if (isMounted.current) {
              setLoadingText("Verifying Payment... Please wait.");
              setLoading(true);
            }

            const freshToken = localStorage.getItem('klubnikaToken');
            if (!freshToken) throw new Error("Authentication lost.");

            const verifyPromise = fetch(`${API_URL}/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${freshToken}`,
              },
              body: JSON.stringify({
                ...response,
                cartItems: cartItems,
                deliveryAddress: formattedAddress,
                deliveryCoords: deliveryCoords,
                totalAmount: totalWithGst,
                orderType: 'Delivery',
                paymentMethod: 'Online'
              }),
            });

            const verifyRes = await verifyPromise;
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              navigate("/my-orders");
            } else {
              alert(verifyData.message || "Payment verification failed.");
            }

          } catch (err) {
            console.error(err);
            alert("Payment verification error: " + err.message);
          } finally {
            if (isMounted.current) setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: {
          color: "#d4a574",
        },
        modal: {
          ondismiss: function () {
            if (isMounted.current) setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);

      rzp.on('payment.failed', function (response) {
        if (isMounted.current) setLoading(false);
        alert("Payment Failed: " + response.error.description);
      });

    } catch (err) {
      alert(err.message || "Error processing request.");
      if (isMounted.current) setLoading(false);
    }
  };

  if (loading) {
    return <Loader message={loadingText} />;
  }

  return (
    <div className="container mx-auto min-h-screen pt-32 pb-20 px-4 relative">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#f0e6d8] mb-8 font-heading">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl text-[#b8a898] mb-6">Your cart is empty.</p>
          <Link to="/dishes" className="button-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          {/* --- CART ITEMS LIST --- */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="glass-card divide-y divide-[#d4a574]/[0.08] overflow-hidden">
              {cartItems.map((item) => {
                const isAvailable = item.isInStock;
                return (
                  <div key={item.title} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 gap-4 ${!isAvailable ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-xl shadow-md shrink-0 ring-1 ring-[#d4a574]/5"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400/231e17/8a7d72?text=Image+Missing'; }}
                      />
                      <div className="flex-1">
                        <h3 className="text-base md:text-xl font-bold text-[#f0e6d8] leading-tight font-heading">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-semibold text-[#d4a574]">{item.price}</span>
                          {!isAvailable && <span className="text-[#e85d75] font-bold text-xs border border-[#e85d75]/30 px-1.5 rounded">SOLD OUT</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-[#d4a574]/[0.08] mt-1 md:mt-0">
                      <div className="flex items-center gap-3 glass-surface px-2 py-1">
                        <button onClick={() => decreaseCartQuantity(item.title)} disabled={!isAvailable} className="h-8 w-8 flex items-center justify-center bg-[#d4a574]/5 text-[#b8a898] rounded-full font-bold text-lg hover:bg-[#d4a574]/10 hover:text-[#d4a574] transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">-</button>
                        <span className="text-lg font-semibold text-[#f0e6d8] w-6 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} disabled={!isAvailable} className="h-8 w-8 flex items-center justify-center bg-[#d4a574]/5 text-[#b8a898] rounded-full font-bold text-lg hover:bg-[#d4a574]/10 hover:text-[#d4a574] transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">+</button>
                      </div>

                      <button onClick={() => removeFromCart(item.title)} className="px-4 py-2 bg-[#e85d75]/10 text-[#e85d75] rounded-full font-semibold text-sm hover:bg-[#e85d75] hover:text-white transition-all cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- ORDER DETAILS --- */}
          <div className="max-w-3xl mx-auto mt-10 p-4 md:p-6 glass-card">
            <h2 className="text-xl font-bold text-[#f0e6d8] mb-4 font-heading">Order Details</h2>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setOrderType('Delivery')}
                className={`flex-1 py-3 rounded-xl font-bold border transition-all duration-300 cursor-pointer ${orderType === 'Delivery' ? 'bg-gradient-to-r from-[#d4a574] to-[#c08552] border-[#d4a574]/50 text-[#0d0b08] shadow-lg shadow-[#d4a574]/15' : 'glass-surface border-transparent text-[#b8a898] hover:text-[#d4a574]'}`}
              >
                🛵 Delivery
              </button>
              <button
                onClick={() => setOrderType('Dine-in')}
                className={`flex-1 py-3 rounded-xl font-bold border transition-all duration-300 cursor-pointer ${orderType === 'Dine-in' ? 'bg-gradient-to-r from-[#e8b44d] to-amber-400 border-amber-400/50 text-[#0d0b08] shadow-lg shadow-amber-500/15' : 'glass-surface border-transparent text-[#b8a898] hover:text-amber-400'}`}
              >
                🍽️ Dine-in (In House)
              </button>
            </div>

            {orderType === 'Dine-in' ? (
              <div className="animate-fadeIn p-4 glass-surface border border-amber-400/10">
                <label className="block text-amber-400 font-semibold mb-2 text-lg font-heading">Table Number</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#231e17]/50 text-[#f0e6d8] text-2xl font-bold border border-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-center transition-all"
                  placeholder="e.g. 5"
                />
                <p className="text-[#8a7d72] text-sm mt-3 text-center">
                  Please enter the number located on your table stand. <br />
                  You will pay at the counter after placing the order.
                </p>
              </div>
            ) : (
              <div className="animate-fadeIn space-y-4">
                <LocationPicker onLocationSelect={handleLocationSelect} />

                <h3 className="text-lg font-semibold text-[#f0e6d8] pt-4 border-t border-[#d4a574]/[0.08] mt-4 font-heading">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-[#b8a898] mb-1">House No / Flat No *</label>
                    <input type="text" name="houseNo" value={address.houseNo} onChange={handleAddressChange} className="input-field" placeholder="e.g. 42-A" />
                  </div>

                  <div>
                    <label className="block text-sm text-[#b8a898] mb-1">Street / Area *</label>
                    <input type="text" name="street" value={address.street} onChange={handleAddressChange} className="input-field" placeholder="e.g. Main Road" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#b8a898] mb-1">Landmark (Optional)</label>
                    <input type="text" name="landmark" value={address.landmark} onChange={handleAddressChange} className="input-field" placeholder="e.g. Near Park" />
                  </div>

                  <div>
                    <label className="block text-sm text-[#b8a898] mb-1">City *</label>
                    <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="input-field" />
                  </div>

                  <div>
                    <label className="block text-sm text-[#b8a898] mb-1">Pincode *</label>
                    <input type="text" name="pincode" value={address.pincode} readOnly={true} className="input-field opacity-60 cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-sm text-[#b8a898] mb-1">State</label>
                    <input type="text" name="state" value={address.state} readOnly={true} className="input-field opacity-60 cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-sm text-[#b8a898] mb-1">Contact Phone *</label>
                    <input type="text" name="phone" value={address.phone} onChange={handleAddressChange} className="input-field" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- SUMMARY --- */}
          <div className="max-w-3xl mx-auto mt-6 p-6 glass-card mb-20">
            <h2 className="text-2xl font-bold text-[#f0e6d8] mb-4 font-heading">Cart Summary</h2>
            <div className="flex justify-between items-center text-lg text-[#b8a898] mb-2">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg text-[#b8a898] mb-2">
              <span>GST (5%)</span>
              <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-lg text-[#b8a898] mb-2">
              <span>Delivery Charge</span>
              <span className={`font-semibold ${deliveryCharge === 0 ? 'text-[#d4a574]' : ''}`}>
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            {orderType === 'Delivery' && deliveryCharge === 0 && subtotal > 0 && (
              <p className="text-xs text-[#d4a574]/80 text-right -mt-2 mb-2">Free delivery applied (Orders above ₹500)</p>
            )}

            <div className="flex justify-between items-center text-lg text-[#b8a898] mb-6">
              <span>Order Type</span>
              <span className="font-semibold text-[#d4a574]">{orderType}</span>
            </div>
            <div className="border-t border-[#d4a574]/[0.1] pt-6 flex justify-between items-center text-2xl font-bold text-[#f0e6d8]">
              <span className="font-heading">Grand Total</span>
              <span className="gradient-text">₹{totalWithGst.toFixed(2)}</span>
            </div>

            {hasSoldOutItem && <p className="text-center text-[#e85d75] mt-4">Please remove sold-out items to proceed.</p>}

            {orderType === 'Delivery' && (
              <>
                {!isWithinRange && deliveryCoords && <p className="text-center text-[#e85d75] mt-4">Your location is outside our delivery range.</p>}
                {!isAddressComplete && isWithinRange && <p className="text-center text-amber-400 mt-4">Please fill in all address details.</p>}
              </>
            )}

            {orderType === 'Dine-in' && !tableNumber && (
              <p className="text-center text-amber-400 mt-4">Please enter a table number.</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!isAuthenticated || hasSoldOutItem || (orderType === 'Dine-in' ? !tableNumber : (!isWithinRange || !isAddressComplete))}
              className={`mt-8 w-full py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer ${orderType === 'Dine-in' ? 'bg-gradient-to-r from-[#e8b44d] to-amber-400 text-[#0d0b08] shadow-amber-500/15 hover:shadow-amber-500/25' : 'bg-gradient-to-r from-[#d4a574] to-[#c08552] text-[#0d0b08] shadow-[#d4a574]/15 hover:shadow-[#d4a574]/25'}`}
            >
              {isAuthenticated
                ? (orderType === 'Dine-in' ? "Place Order (Pay at Counter)" : "Proceed to Payment")
                : "Login to Checkout"
              }
            </button>
          </div>
        </>
      )}

      {/* --- PAYMENT METHOD MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="glass-card w-full max-w-md p-6 shadow-2xl transform transition-all animate-slideUp">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-[#f0e6d8] font-heading">Choose Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-[#8a7d72] hover:text-[#f0e6d8] text-2xl transition-colors cursor-pointer">×</button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleOnlinePayment}
                className="w-full flex items-center justify-between p-4 glass-surface hover:bg-[#d4a574]/[0.08] hover:ring-1 hover:ring-[#d4a574]/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#d4a574]/10 rounded-full flex items-center justify-center text-2xl">💳</div>
                  <div className="text-left">
                    <h3 className="font-bold text-[#f0e6d8] group-hover:text-[#d4a574] transition-colors">Pay Online</h3>
                    <p className="text-xs text-[#8a7d72]">UPI, Cards, NetBanking</p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border-2 border-[#8a7d72] group-hover:border-[#d4a574] transition-colors"></div>
              </button>

              <button
                onClick={handleCODPayment}
                className="w-full flex items-center justify-between p-4 glass-surface hover:bg-amber-400/[0.08] hover:ring-1 hover:ring-amber-400/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center text-2xl">💵</div>
                  <div className="text-left">
                    <h3 className="font-bold text-[#f0e6d8] group-hover:text-amber-400 transition-colors">Cash on Delivery</h3>
                    <p className="text-xs text-[#8a7d72]">Pay cash when food arrives</p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border-2 border-[#8a7d72] group-hover:border-amber-400 transition-colors"></div>
              </button>

              <p className="text-xs text-[#e85d75] text-center font-bold mt-2">
                * Note: Delivery charge may change based on the distance.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#8a7d72]">Secure Payment • 100% Refund Guarantee</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
