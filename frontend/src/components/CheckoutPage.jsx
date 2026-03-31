import React, { useState, useCallback } from "react";
import LocationPicker from "./LocationPicker";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    houseNo: "", street: "", landmark: "", city: "", state: "", pincode: "", phone: "", fullName: "",
  });
  const [deliveryAllowed, setDeliveryAllowed] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const handleLocationUpdate = useCallback((coords, isWithinRange, addressData) => {
    setDeliveryAllowed(isWithinRange);
    setCoordinates(coords);
    setFormData((prev) => ({
      ...prev,
      street: addressData.formatted_address || prev.street,
      city: addressData.city || prev.city,
      state: addressData.state || prev.state,
      pincode: addressData.pincode || prev.pincode,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.houseNo || !formData.fullName || !formData.phone) {
      alert("Please complete all required fields (Name, Phone, House No).");
      return;
    }
    const fullReadableAddress = `${formData.houseNo}, ${formData.street}, ${formData.landmark ? "Near " + formData.landmark + "," : ""} ${formData.city}, ${formData.state} - ${formData.pincode}`.replace(/\s+/g, " ").trim();
    const mapsLink = coordinates ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}` : "";
    const finalOrderData = {
      customer: { name: formData.fullName, phone: formData.phone },
      deliveryAddress: fullReadableAddress, googleMapsLink: mapsLink, location: coordinates,
    };
    console.log("🚀 SENDING TO BACKEND:", finalOrderData);
    alert("Order Data Prepared! Check Console.");
  };

  return (
    <div className="p-4 bg-[#0d0b08] min-h-screen text-[#f0e6d8] pt-24">
      <h1 className="text-2xl font-bold mb-4 gradient-text font-heading">Checkout</h1>

      <LocationPicker onLocationSelect={handleLocationUpdate} />

      <div className="mt-8 space-y-5 max-w-xl">
        <h3 className="text-xl font-semibold border-b border-white/[0.06] pb-2 font-heading">2. Personal Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name *" className="input-field" />
          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number *" className="input-field" />
        </div>

        <h3 className="text-xl font-semibold border-b border-white/[0.06] pb-2 pt-4 font-heading">3. Delivery Address Details</h3>
        <div>
          <label className="block text-sm text-[#8a7d72] mb-1">House No / Flat No *</label>
          <input name="houseNo" value={formData.houseNo} onChange={handleInputChange} placeholder="e.g. 42-A" className="input-field" />
        </div>
        <div>
          <label className="block text-sm text-[#8a7d72] mb-1">Street / Area (Auto-filled) *</label>
          <textarea name="street" value={formData.street} onChange={handleInputChange} rows="2" placeholder="Street / Area" className="input-field resize-none"></textarea>
        </div>
        <div>
          <label className="block text-sm text-[#8a7d72] mb-1">Landmark (Optional)</label>
          <input name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="e.g. Near City Park" className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#8a7d72] mb-1">City *</label>
            <input name="city" value={formData.city} onChange={handleInputChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-[#8a7d72] mb-1">Pincode *</label>
            <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#8a7d72] mb-1">State *</label>
          <input name="state" value={formData.state} onChange={handleInputChange} className="input-field" />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!deliveryAllowed}
          className={`w-full py-4 mt-8 font-bold text-lg rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer ${deliveryAllowed
            ? "bg-gradient-to-r from-[#d4a574] to-[#c08552] text-[#0d0b08] hover:shadow-[#d4a574]/25"
            : "bg-[#2e261d] text-[#8a7d72] cursor-not-allowed"
            }`}
        >
          {deliveryAllowed ? "Proceed to Pay" : "Location Not Serviceable"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;