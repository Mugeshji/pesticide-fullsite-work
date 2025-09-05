import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, cartItems, total } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingOption, setShippingOption] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAmount, setSavedAmount] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [errors, setErrors] = useState({});

  // Available coupons
  const availableCoupons = [
    { code: "SAVE10", discount: 0.1, minAmount: 500, description: "10% off on orders above ₹500" },
    { code: "SAVE20", discount: 0.2, minAmount: 1000, description: "20% off on orders above ₹1000" },
    { code: "FLASH50", discount: 0.05, minAmount: 200, description: "5% off on orders above ₹200" },
    { code: "NEWUSER", discount: 0.15, minAmount: 300, description: "15% off for new users" }
  ];

  // Shipping options
  const shippingOptions = [
    { id: "standard", name: "Standard Delivery", price: 40, days: "5-7", icon: "🚛" },
    { id: "express", name: "Express Delivery", price: 100, days: "2-3", icon: "⚡" },
    { id: "overnight", name: "Overnight Delivery", price: 200, days: "1", icon: "🚀" }
  ];

  // Calculate initial values based on whether it's a single product or cart
  const isCartCheckout = cartItems && cartItems.length > 0;
  const initialSubtotal = isCartCheckout ? total : (product ? product.price : 0);
  
  useEffect(() => {
    // Calculate estimated delivery date
    const currentShipping = shippingOptions.find(option => option.id === shippingOption);
    const maxDays = parseInt(currentShipping.days.split('-')[1] || currentShipping.days);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + maxDays);
    setDeliveryDate(estimatedDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, [shippingOption]);

  if (!product && !cartItems) {
    return (
      <motion.div 
        className="error-page"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚠️
        </motion.div>
        <h2>No product selected for checkout</h2>
        <motion.button
          onClick={() => navigate("/home")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="back-btn"
        >
          ← Go Back to Shop
        </motion.button>
      </motion.div>
    );
  }

  // Enhanced coupon application
  const applyCoupon = () => {
    const couponCode = coupon.toUpperCase();
    const validCoupon = availableCoupons.find(c => c.code === couponCode);
    const subtotal = isCartCheckout ? total : product.price * quantity;
    
    if (validCoupon && subtotal >= validCoupon.minAmount) {
      setDiscount(validCoupon.discount);
      setSavedAmount((subtotal * validCoupon.discount).toFixed(2));
      setErrors({...errors, coupon: ""});
    } else if (validCoupon && subtotal < validCoupon.minAmount) {
      setErrors({...errors, coupon: `Minimum order amount ₹${validCoupon.minAmount} required`});
      setDiscount(0);
      setSavedAmount(0);
    } else {
      setErrors({...errors, coupon: "Invalid coupon code"});
      setDiscount(0);
      setSavedAmount(0);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setSavedAmount(0);
    setErrors({...errors, coupon: ""});
  };

  // Price calculations
  const subtotal = isCartCheckout ? total : product.price * quantity;
  const discountAmount = subtotal * discount;
  const currentShipping = shippingOptions.find(option => option.id === shippingOption);
  const shippingCost = subtotal >= 999 ? 0 : currentShipping.price; // Free shipping above ₹999
  const tax = (subtotal - discountAmount) * 0.18; // 18% GST
  const totalPrice = (subtotal - discountAmount + shippingCost + tax).toFixed(2);

  const handlePayNow = async () => {
    setIsProcessing(true);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      if (isCartCheckout) {
        // Handle cart checkout - update all products in cart
        for (const item of cartItems) {
          const newQuantity = item.quantity - item.quantity;
          
          if (newQuantity < 0) {
            alert(`⚠️ Not enough stock available for ${item.name}!`);
            setIsProcessing(false);
            return;
          }

          const response = await fetch(
            `https://pesticide-fullsite-work.onrender.com/api/update-quantity/${item._id || item.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity: newQuantity }),
            }
          );

          if (!response.ok) {
            const data = await response.json();
            alert(data.message || `Failed to update quantity for ${item.name}`);
            setIsProcessing(false);
            return;
          }
        }
      } else {
        // Handle single product checkout
        const newQuantity = product.quantity - quantity;

        if (newQuantity < 0) {
          alert("⚠️ Not enough stock available!");
          setIsProcessing(false);
          return;
        }

        const response = await fetch(
          `https://pesticide-fullsite-work.onrender.com/api/update-quantity/${product._id || product.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          alert(data.message || "Failed to update quantity in DB");
          setIsProcessing(false);
          return;
        }
      }

      // ✅ success flow
      setConfirmation(
        `🎉 Payment successful! Your order of ₹${totalPrice} has been placed. Order ID: #ORD${Date.now()}`
      );
      
      // Clear cart if this was a cart checkout
      if (isCartCheckout) {
        localStorage.removeItem("cartItems");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Something went wrong while updating quantity");
    } finally {
      setIsProcessing(false);
    }
  };

  const validatePaymentDetails = () => {
    const newErrors = {};
    
    if (paymentMethod === "upi" && !paymentDetails.upiId) {
      newErrors.upi = "UPI ID is required";
    }
    
    if (paymentMethod === "card") {
      if (!paymentDetails.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!paymentDetails.expiry) newErrors.expiry = "Expiry date is required";
      if (!paymentDetails.cvv) newErrors.cvv = "CVV is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <section className="payment_section">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .payment_section { font-family: 'Poppins', sans-serif; background: #f9f9f9; min-height: 100vh; padding: 20px; }
        .payment-container { max-width: 1200px; margin: 0 auto; }
        .checkout-header { margin-bottom: 30px; }
        .breadcrumb { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 14px; color: #666; }
        .breadcrumb-link { cursor: pointer; color: #ffcc00; font-weight: 600; }
        .breadcrumb-link:hover { text-decoration: underline; }
        .breadcrumb-separator { color: #999; }
        .breadcrumb-current { color: #333; font-weight: 600; }
        .checkout-title { font-size: 2.5rem; font-weight: 700; color: #111; margin: 0; }
        .checkout-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        @media (max-width: 992px) { .checkout-layout { grid-template-columns: 1fr; } }
        .left-column { display: flex; flex-direction: column; gap: 20px; }
        .product-card, .coupon-card, .shipping-card, .payment-card { background: #fff; border-radius: 15px; padding: 25px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-header h3 { font-size: 1.3rem; font-weight: 700; color: #111; margin: 0; }
        .secure-badge { background: #ffcc00; color: #111; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .product-summary { display: flex; gap: 20px; }
        @media (max-width: 576px) { .product-summary { flex-direction: column; } }
        .product-image-container { position: relative; width: 120px; height: 120px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
        .product-img { width: 100%; height: 100%; object-fit: cover; }
        .image-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
        .product-image-container:hover .image-overlay { opacity: 1; }
        .product-info { flex: 1; }
        .product-info h3 { font-size: 1.2rem; font-weight: 600; color: #111; margin-bottom: 10px; }
        .price-display { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .current-price { font-size: 1.3rem; font-weight: 700; color: #ffcc00; }
        .original-price { font-size: 1rem; color: #999; text-decoration: line-through; }
        .price-badge { background: #28a745; color: white; padding: 3px 8px; border-radius: 15px; font-size: 0.8rem; font-weight: 600; }
        .quantity-section { margin-bottom: 15px; }
        .quantity-section label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
        .quantity-controls { display: flex; align-items: center; gap: 15px; }
        .qty-btn { background: #111; color: #ffcc00; border: 2px solid #ffcc00; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-weight: bold; }
        .qty-btn:hover { background: #ffcc00; color: #111; transform: scale(1.1); }
        .qty-display { background: #fff; border: 2px solid #ffcc00; padding: 8px 15px; border-radius: 25px; font-weight: 600; color: #111; min-width: 60px; text-align: center; }
        .delivery-info { background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 15px; }
        .delivery-row { display: flex; align-items: center; gap: 10px; }
        .delivery-icon { font-size: 1.5rem; }
        .delivery-text { font-weight: 600; color: #333; }
        .delivery-subtext { font-size: 0.9rem; color: #666; }
        .coupon-input-section { margin-bottom: 20px; }
        .coupon-box { display: flex; gap: 10px; margin-bottom: 10px; }
        .coupon-box input { flex: 1; padding: 12px 15px; border: 2px solid #ddd; border-radius: 25px; font-size: 1rem; }
        .coupon-box input:focus { outline: none; border-color: #ffcc00; }
        .coupon-box input.error { border-color: #dc3545; }
        .coupon-box button { background: #ffcc00; color: #111; border: none; padding: 12px 20px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .coupon-box button:hover { background: #ffd633; transform: scale(1.05); }
        .remove-coupon-btn { background: #dc3545 !important; color: white !important; }
        .error-message { color: #dc3545; font-size: 0.9rem; margin-top: 5px; }
        .coupon-success { display: flex; align-items: center; gap: 10px; background: #d4edda; color: #155724; padding: 10px 15px; border-radius: 10px; margin-top: 10px; }
        .success-icon { font-size: 1.2rem; }
        .available-coupons { margin-top: 20px; }
        .available-coupons h4 { margin-bottom: 10px; font-size: 1rem; color: #333; }
        .coupons-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media (max-width: 768px) { .coupons-grid { grid-template-columns: 1fr; } }
        .coupon-item { background: #f8f9fa; padding: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; border: 2px solid transparent; }
        .coupon-item:hover { border-color: #ffcc00; transform: translateY(-2px); }
        .coupon-code { font-weight: 700; color: #ffcc00; margin-bottom: 5px; }
        .coupon-description { font-size: 0.9rem; color: #666; }
        .shipping-options { display: flex; flex-direction: column; gap: 15px; }
        .shipping-option { display: flex; align-items: center; gap: 15px; padding: 15px; border: 2px solid #ddd; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; }
        .shipping-option.selected { border-color: #ffcc00; background: #fff9e6; }
        .shipping-option input[type="radio"] { accent-color: #ffcc00; }
        .shipping-info { flex: 1; }
        .shipping-header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
        .shipping-icon { font-size: 1.2rem; }
        .shipping-name { font-weight: 600; color: #333; flex: 1; }
        .shipping-price { font-weight: 700; color: #ffcc00; }
        .shipping-duration { font-size: 0.9rem; color: #666; }
        .free-shipping-badge { background: #d4edda; color: #155724; padding: 10px 15px; border-radius: 10px; margin-top: 15px; text-align: center; font-weight: 600; }
        .payment-methods-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
        @media (max-width: 576px) { .payment-methods-grid { grid-template-columns: 1fr; } }
        .payment-method { display: flex; align-items: center; gap: 15px; padding: 15px; border: 2px solid #ddd; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; }
        .payment-method.selected { border-color: #ffcc00; background: #fff9e6; }
        .payment-method input[type="radio"] { accent-color: #ffcc00; }
        .method-content { flex: 1; }
        .method-header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
        .method-icon { font-size: 1.2rem; }
        .method-name { font-weight: 600; color: #333; flex: 1; }
        .method-subtitle { font-size: 0.9rem; color: #666; }
        .payment-details { margin-top: 20px; }
        .payment-input { width: 100%; padding: 12px 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 1rem; margin-bottom: 15px; }
        .payment-input:focus { outline: none; border-color: #ffcc00; }
        .payment-input.error { border-color: #dc3545; }
        .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card-security { font-size: 0.9rem; color: #666; text-align: center; margin-top: 10px; }
        .cod-info { display: flex; align-items: center; gap: 15px; background: #f8f9fa; padding: 15px; border-radius: 10px; }
        .cod-icon { font-size: 1.5rem; }
        .cod-text { font-weight: 600; color: #333; }
        .cod-subtext { font-size: 0.9rem; color: #666; }
        .right-column { position: relative; }
        .order-summary-card { background: #fff; border-radius: 15px; padding: 25px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); position: sticky; top: 20px; }
        .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .summary-header h3 { font-size: 1.3rem; font-weight: 700; color: #111; margin: 0; }
        .toggle-summary { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #666; }
        .summary-content { margin-bottom: 20px; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
        .summary-row.discount { color: #28a745; font-weight: 600; }
        .summary-row.total { font-size: 1.2rem; font-weight: 700; color: #111; border-top: 2px solid #ffcc00; margin-top: 15px; padding-top: 15px; }
        .free-text { color: #28a745; font-weight: 600; }
        .summary-divider { height: 1px; background: #eee; margin: 15px 0; }
        .savings-badge { background: #d4edda; color: #155724; padding: 10px 15px; border-radius: 10px; margin-top: 15px; text-align: center; font-weight: 600; }
        .pay-btn { width: 100%; background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%); color: #111; border: none; padding: 18px; border-radius: 30px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 20px; }
        .pay-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,204,0,0.4); }
        .pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .processing-content { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pay-content { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .pay-icon { font-size: 1.2rem; }
        .pay-secure { font-size: 0.8rem; color: #666; }
        .trust-badges { display: flex; justify-content: center; gap: 15px; margin-top: 15px; }
        .trust-badge { font-size: 0.8rem; color: #666; }
        .confirmation-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .confirmation-modal { background: #fff; border-radius: 15px; padding: 30px; text-align: center; max-width: 500px; width: 90%; }
        .success-animation { font-size: 4rem; margin-bottom: 20px; }
        .confirmation-modal h2 { font-size: 1.8rem; font-weight: 700; color: #111; margin-bottom: 15px; }
        .confirmation-modal p { font-size: 1.1rem; color: #666; margin-bottom: 25px; }
        .confirmation-actions { display: flex; gap: 15px; justify-content: center; }
        .confirmation-actions button { padding: 12px 25px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .continue-shopping-btn { background: #ffcc00; color: #111; border: none; }
        .continue-shopping-btn:hover { background: #ffd633; transform: translateY(-2px); }
        .close-btn { background: transparent; border: 2px solid #ddd; color: #666; }
        .close-btn:hover { border-color: #ffcc00; color: #111; }
        .error-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; }
        .error-page h2 { font-size: 1.8rem; font-weight: 700; color: #111; margin: 20px 0; }
        .back-btn { background: #ffcc00; color: #111; border: none; padding: 12px 25px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .back-btn:hover { background: #ffd633; transform: translateY(-2px); }
      `}</style>

      <motion.div
        className="payment-container"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header with breadcrumb */}
        <motion.div
          className="checkout-header"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="breadcrumb">
            <span onClick={() => navigate("/home")} className="breadcrumb-link">Shop</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Checkout</span>
          </div>
          <motion.h1
            className="checkout-title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              animate={{ textShadow: ["0 0 10px #ffff00", "0 0 20px #ffff00", "0 0 10px #ffff00"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🛒 Secure Checkout
            </motion.span>
          </motion.h1>
        </motion.div>

        <div className="checkout-layout">
          {/* Left Column - Product & Payment Details */}
          <div className="left-column">
            {/* Enhanced Product Summary */}
            <motion.div
              className="product-card"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="card-header">
                <h3>📦 Order Details</h3>
                <motion.div 
                  className="secure-badge"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔒 Secure
                </motion.div>
              </div>
              
              {isCartCheckout ? (
                <div className="cart-summary">
                  <h4>Cart Items ({cartItems.length})</h4>
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item-summary">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-details">
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="product-summary">
                  <motion.div
                    className="product-image-container"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <img
                      src={`https://pesticide-fullsite-work.onrender.com${product.image}`}
                      alt={product.name}
                      className="product-img"
                    />
                    <div className="image-overlay">
                      <span>🔍</span>
                    </div>
                  </motion.div>
                  
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="price-display">
                      <span className="current-price">₹{product.price}</span>
                      <span className="original-price">₹{(product.price * 1.3).toFixed(0)}</span>
                      <span className="price-badge">23% OFF</span>
                    </div>
                    
                    <div className="quantity-section">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="qty-btn"
                        >
                          −
                        </motion.button>
                        <span className="qty-display">{quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity(quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Information */}
              <motion.div
                className="delivery-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="delivery-row">
                  <span className="delivery-icon">{currentShipping.icon}</span>
                  <div>
                    <div className="delivery-text">
                      Estimated delivery: <strong>{deliveryDate}</strong>
                    </div>
                    <div className="delivery-subtext">
                      {currentShipping.name} ({currentShipping.days} business days)
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Coupon Section */}
            <motion.div
              className="coupon-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3>💰 Apply Coupon</h3>
              <div className="coupon-input-section">
                <div className="coupon-box">
                  <motion.input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className={errors.coupon ? "error" : ""}
                    whileFocus={{ scale: 1.02 }}
                  />
                  {discount > 0 ? (
                    <motion.button 
                      onClick={removeCoupon}
                      className="remove-coupon-btn"
                      whileHover={{ scale: 1.05 }}
                    >
                      ✕
                    </motion.button>
                  ) : (
                    <motion.button 
                      onClick={applyCoupon}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply
                    </motion.button>
                  )}
                </div>
                
                {errors.coupon && (
                  <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    ⚠️ {errors.coupon}
                  </motion.div>
                )}
                
                {discount > 0 && (
                  <motion.div
                    className="coupon-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="success-icon">🎉</span>
                    <span>Coupon Applied! You saved ₹{savedAmount}</span>
                  </motion.div>
                )}
              </div>

              {/* Available Coupons */}
              <div className="available-coupons">
                <h4>Available Offers:</h4>
                <div className="coupons-grid">
                  {availableCoupons.map((couponItem, idx) => (
                    <motion.div
                      key={couponItem.code}
                      className="coupon-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setCoupon(couponItem.code)}
                    >
                      <div className="coupon-code">{couponItem.code}</div>
                      <div className="coupon-description">{couponItem.description}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Shipping Options */}
            <motion.div
              className="shipping-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3>🚚 Delivery Options</h3>
              <div className="shipping-options">
                {shippingOptions.map((option) => (
                  <motion.label
                    key={option.id}
                    className={`shipping-option ${shippingOption === option.id ? 'selected' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={option.id}
                      checked={shippingOption === option.id}
                      onChange={(e) => setShippingOption(e.target.value)}
                    />
                    <div className="shipping-info">
                      <div className="shipping-header">
                        <span className="shipping-icon">{option.icon}</span>
                        <span className="shipping-name">{option.name}</span>
                        <span className="shipping-price">
                          {subtotal >= 999 && option.id === 'standard' ? 'FREE' : `₹${option.price}`}
                        </span>
                      </div>
                      <div className="shipping-duration">{option.days} business days</div>
                    </div>
                  </motion.label>
                ))}
                
                {subtotal >= 999 && (
                  <motion.div
                    className="free-shipping-badge"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    🎉 You've unlocked FREE standard shipping!
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Payment Methods */}
            <motion.div
              className="payment-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3>💳 Payment Method</h3>

              <div className="payment-methods-grid">
                {[
                  { id: "upi", name: "UPI Payment", icon: "📱", subtitle: "Google Pay / PhonePe / Paytm" },
                  { id: "card", name: "Debit / Credit Card", icon: "💳", subtitle: "Visa, Mastercard, RuPay" },
                  { id: "netbanking", name: "Net Banking", icon: "🏦", subtitle: "All major banks supported" },
                  { id: "cod", name: "Cash on Delivery", icon: "💵", subtitle: "Pay when you receive" }
                ].map((method) => (
                  <motion.label
                    key={method.id}
                    className={`payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-header">
                        <span className="method-icon">{method.icon}</span>
                        <span className="method-name">{method.name}</span>
                      </div>
                      <div className="method-subtitle">{method.subtitle}</div>
                    </div>
                  </motion.label>
                ))}
              </div>

              {/* Conditional Payment Details */}
              <AnimatePresence mode="wait">
                {paymentMethod === "upi" && (
                  <motion.div
                    key="upi"
                    className="payment-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g., 9876543210@paytm)"
                      className={`payment-input ${errors.upi ? 'error' : ''}`}
                      onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                    />
                    {errors.upi && <div className="error-message">⚠️ {errors.upi}</div>}
                  </motion.div>
                )}

                {paymentMethod === "card" && (
                  <motion.div
                    key="card"
                    className="payment-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="text"
                      placeholder="Card Number (1234 5678 9012 3456)"
                      maxLength="19"
                      className={`payment-input ${errors.cardNumber ? 'error' : ''}`}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        e.target.value = value;
                        setPaymentDetails({...paymentDetails, cardNumber: value});
                      }}
                    />
                    {errors.cardNumber && <div className="error-message">⚠️ {errors.cardNumber}</div>}
                    
                    <div className="card-row">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`payment-input ${errors.expiry ? 'error' : ''}`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                          e.target.value = value;
                          setPaymentDetails({...paymentDetails, expiry: value});
                        }}
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength="3"
                        className={`payment-input ${errors.cvv ? 'error' : ''}`}
                        onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      />
                    </div>
                    <div className="card-security">🔒 Your card details are encrypted and secure</div>
                  </motion.div>
                )}

                {paymentMethod === "netbanking" && (
                  <motion.div
                    key="netbanking"
                    className="payment-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <select className="payment-input">
                      <option>Select Your Bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Bank of Baroda</option>
                      <option>Canara Bank</option>
                    </select>
                  </motion.div>
                )}

                {paymentMethod === "cod" && (
                  <motion.div
                    key="cod"
                    className="payment-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="cod-info">
                      <span className="cod-icon">💵</span>
                      <div>
                        <div className="cod-text">Pay ₹{totalPrice} in cash when your order arrives</div>
                        <div className="cod-subtext">Additional charges may apply for COD orders</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <motion.div
            className="right-column"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="order-summary-card"
              animate={{ 
                boxShadow: showOrderSummary 
                  ? ["0 0 20px rgba(255, 255, 0, 0.3)", "0 0 40px rgba(255, 255, 0, 0.5)", "0 0 20px rgba(255, 255, 0, 0.3)"]
                  : "0 0 20px rgba(255, 255, 0, 0.3)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="summary-header">
                <h3>📋 Order Summary</h3>
                <motion.button
                  className="toggle-summary"
                  onClick={() => setShowOrderSummary(!showOrderSummary)}
                  whileTap={{ scale: 0.9 }}
                >
                  {showOrderSummary ? '▼' : '▶'}
                </motion.button>
              </div>

              <AnimatePresence>
                {showOrderSummary && (
                  <motion.div
                    className="summary-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="summary-row">
                      <span>Subtotal ({isCartCheckout ? cartItems.length : quantity} item{isCartCheckout || quantity > 1 ? 's' : ''})</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <motion.div
                        className="summary-row discount"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span>Coupon Discount</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </motion.div>
                    )}

                    <div className="summary-row">
                      <span>Shipping ({currentShipping.name})</span>
                      <span className={shippingCost === 0 ? "free-text" : ""}>
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>GST (18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>₹{totalPrice}</span>
                    </div>

                    {savedAmount > 0 && (
                      <motion.div
                        className="savings-badge"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🎉 You're saving ₹{savedAmount}!
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Pay Button */}
              <motion.button
                className="pay-btn"
                onClick={() => {
                  if (validatePaymentDetails()) {
                    handlePayNow();
                  }
                }}
                disabled={isProcessing}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(255, 255, 0, 0.8)",
                }}
                whileTap={{ scale: 0.98 }}
                animate={isProcessing ? { 
                  background: ["#ffff00", "#ffeb3b", "#ffff00"],
                } : {}}
                transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
              >
                {isProcessing ? (
                  <motion.div className="processing-content">
                    <motion.div
                      className="spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.div>
                    Processing Payment...
                  </motion.div>
                ) : (
                  <div className="pay-content">
                    <span className="pay-icon">🔒</span>
                    <span>Pay ₹{totalPrice}</span>
                    <span className="pay-secure">Secure Payment</span>
                  </div>
                )}
              </motion.button>

              <div className="trust-badges">
                <div className="trust-badge">🔒 SSL Secured</div>
                <div className="trust-badge">✅ 100% Safe</div>
                <div className="trust-badge">🛡️ Protected</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Confirmation */}
        <AnimatePresence>
          {confirmation && (
            <motion.div
              className="confirmation-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="confirmation-modal"
                initial={{ scale: 0.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 100 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <motion.div
                  className="success-animation"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1 }}
                >
                  ✅
                </motion.div>
                <h2>Order Placed Successfully!</h2>
                <p>{confirmation}</p>
                <div className="confirmation-actions">
                  <motion.button
                    onClick={() => navigate("/home")}
                    whileHover={{ scale: 1.05 }}
                    className="continue-shopping-btn"
                  >
                    Continue Shopping
                  </motion.button>
                  <motion.button
                    onClick={() => setConfirmation("")}
                    whileHover={{ scale: 1.05 }}
                    className="close-btn"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced CSS Styles */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .payment_section {
          background: linear-gradient(135deg, #000000, #1a1a1a, #000000);
          color: #fff;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }

        .payment-container {
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(135deg, #111111, #1f1f1f);
          border: 3px solid #ffff00;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 0 50px rgba(255, 255, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .payment-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 0, 0.03), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          50% { transform: translateX(0) translateY(0) rotate(45deg); }
        }

        .error-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          background: linear-gradient(135deg, #000, #1a1a1a);
          color: #ffff00;
          font-size: 24px;
          gap: 20px;
        }

        .back-btn {
          background: #ffff00;
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .checkout-header {
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }

        .breadcrumb {
          font-size: 14px;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .breadcrumb-link {
          color: #ffff00;
          cursor: pointer;
          text-decoration: underline;
        }

        .breadcrumb-separator {
          margin: 0 8px;
        }

        .breadcrumb-current {
          color: #fff;
        }

        .checkout-title {
          text-align: center;
          font-size: 32px;
          color: #ffff00;
          margin: 0;
          font-weight: bold;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 30px;
          position: relative;
          z-index: 1;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .right-column {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .product-card, .coupon-card, .shipping-card, .payment-card, .order-summary-card {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          border: 2px solid #ffff00;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h3 {
          color: #ffff00;
          font-size: 20px;
          margin: 0;
        }

        .secure-badge {
          background: #ffff00;
          color: #000;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .product-summary {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .product-image-container {
          position: relative;
          flex-shrink: 0;
        }

        .product-img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #ffff00;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 12px;
          font-size: 24px;
        }

        .product-image-container:hover .image-overlay {
          opacity: 1;
        }

        .product-info {
          flex: 1;
        }

        .product-info h3 {
          color: #fff;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .price-display {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .current-price {
          font-size: 20px;
          font-weight: bold;
          color: #ffff00;
        }

        .original-price {
          text-decoration: line-through;
          color: #888;
          font-size: 14px;
        }

        .price-badge {
          background: #ff4444;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .quantity-section {
          margin-bottom: 15px;
        }

        .quantity-section label {
          display: block;
          margin-bottom: 8px;
          color: #ffff00;
          font-weight: bold;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-btn {
          width: 35px;
          height: 35px;
          border: 2px solid #ffff00;
          background: #000;
          color: #ffff00;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-display {
          font-size: 18px;
          font-weight: bold;
          min-width: 30px;
          text-align: center;
          color: #ffff00;
        }

        .delivery-info {
          background: rgba(255, 255, 0, 0.1);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 0, 0.3);
        }


 .delivery-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .delivery-icon {
          font-size: 24px;
        }

        .delivery-text {
          color: #fff;
          font-weight: bold;
        }

        .delivery-subtext {
          color: #ccc;
          font-size: 14px;
        }

        .coupon-input-section {
          margin-bottom: 20px;
        }

        .coupon-box {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .coupon-box input {
          flex: 1;
          padding: 12px;
          border: 2px solid #ffff00;
          background: #000;
          color: #ffff00;
          border-radius: 8px;
          font-size: 14px;
        }

        .coupon-box input.error {
          border-color: #ff4444;
        }

        .coupon-box button, .remove-coupon-btn {
          padding: 12px 20px;
          border: none;
          background: #ffff00;
          color: #000;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
        }

        .remove-coupon-btn {
          background: #ff4444;
          color: white;
        }

        .error-message {
          color: #ff4444;
          font-size: 12px;
          margin-top: 5px;
        }

        .coupon-success {
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.3);
          padding: 10px;
          border-radius: 8px;
          color: #00ff00;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 .available-coupons h4 {
          color: #ffff00;
          margin-bottom: 15px;
        }

        .coupons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .coupon-item {
          background: rgba(255, 255, 0, 0.1);
          border: 1px solid rgba(255, 255, 0, 0.3);
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .coupon-item:hover {
          background: rgba(255, 255, 0, 0.2);
          border-color: rgba(255, 255, 0, 0.5);
        }

        .coupon-code {
          font-weight: bold;
          color: #ffff00;
          margin-bottom: 4px;
        }

        .coupon-description {
          font-size: 12px;
          color: #ccc;
        }

        .shipping-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shipping-option {
          display: flex;
          align-items: center;
          background: #222;
          padding: 15px;
          border: 2px solid #ffff00;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .shipping-option.selected {
          background: rgba(255, 255, 0, 0.1);
          border-color: #ffff00;
          box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
        }

        .shipping-option input {
          margin-right: 15px;
        }

        .shipping-info {
          flex: 1;
        }

        .shipping-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .shipping-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        .shipping-name {
          font-weight: bold;
          color: #fff;
        }

        .shipping-price {
          font-weight: bold;
          color: #ffff00;
        }

        .shipping-duration {
          font-size: 14px;
          color: #ccc;
        }

        .free-shipping-badge {
          background: linear-gradient(90deg, #00ff00, #00cc00);
          color: white;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          margin-top: 10px;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .payment-method {
          display: flex;
          align-items: center;
          background: #222;
          padding: 15px;
          border: 2px solid #ffff00;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .payment-method.selected {
          background: rgba(255, 255, 0, 0.1);
          border-color: #ffff00;
          box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
        }

        .payment-method input {
          margin-right: 15px;
        }

        .method-content {
          flex: 1;
        }

        .method-header {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }

        .method-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        .method-name {
          font-weight: bold;
          color: #fff;
        }

        .method-subtitle {
          font-size: 12px;
          color: #ccc;
        }

        .payment-details {
          margin-top: 20px;
          padding: 20px;
          background: rgba(255, 255, 0, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 0, 0.2);
        }

        .payment-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 2px solid #ffff00;
          border-radius: 8px;
          background: #000;
          color: #ffff00;
          font-size: 14px;
        }

        .payment-input.error {
          border-color: #ff4444;
        }

        .payment-input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
        }

        .card-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .card-security {
          font-size: 12px;
          color: #00ff00;
          text-align: center;
          margin-top: 10px;
        }

        .cod-info {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 0, 0.1);
          border-radius: 8px;
        }

        .cod-icon {
          font-size: 30px;
        }

        .cod-text {
          font-weight: bold;
          color: #fff;
          margin-bottom: 4px;
        }

        .cod-subtext {
          font-size: 12px;
          color: #ccc;
        }

        .order-summary-card {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          border: 2px solid #ffff00;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .summary-header h3 {
          color: #ffff00;
          font-size: 20px;
          margin: 0;
        }

        .toggle-summary {
          background: none;
          border: 1px solid #ffff00;
          color: #ffff00;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        .summary-content {
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 0, 0.2);
        }

        .summary-row.discount {
          color: #00ff00;
        }

        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
          color: #ffff00;
          border-bottom: none;
          padding-top: 15px;
        }

        .summary-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffff00, transparent);
          margin: 15px 0;
        }

        .free-text {
          color: #00ff00;
          font-weight: bold;
        }

        .savings-badge {
          background: linear-gradient(90deg, #00ff00, #00cc00);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          text-align: center;
          font-weight: bold;
          margin-top: 15px;
        }

        .pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #ffff00, #ffeb3b);
          color: #000;
          border: none;
          padding: 18px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .pay-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .pay-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .pay-icon {
          font-size: 20px;
        }

        .pay-secure {
          font-size: 12px;
          opacity: 0.8;
        }

        .processing-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          font-size: 20px;
        }

        .trust-badges {
          display: flex;
          justify-content: space-around;
          gap: 10px;
        }

        .trust-badge {
          font-size: 12px;
          color: #00ff00;
          text-align: center;
          flex: 1;
        }

        .confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .confirmation-modal {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          border: 3px solid #ffff00;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          max-width: 500px;
          width: 90%;
        }

        .success-animation {
          font-size: 60px;
          margin-bottom: 20px;
        }

        .confirmation-modal h2 {
          color: #ffff00;
          margin-bottom: 15px;
        }

        .confirmation-modal p {
          color: #fff;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .confirmation-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .continue-shopping-btn, .close-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }

        .continue-shopping-btn {
          background: #ffff00;
          color: #000;
        }

        .close-btn {
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
        }

        @media (max-width: 1200px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .right-column {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .payment-container {
            padding: 20px;
            margin: 10px;
          }
          
          .checkout-title {
            font-size: 24px;
          }
          
          .product-summary {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .payment-methods-grid {
            grid-template-columns: 1fr;
          }
          
          .coupons-grid {
            grid-template-columns: 1fr;
          }
          
          .card-row {
            grid-template-columns: 1fr;
          }
          
          .confirmation-modal {
            margin: 20px;
            padding: 30px;
          }
          
          .confirmation-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .quantity-controls {
            justify-content: center;
          }
          
          .trust-badges {
            flex-direction: column;
            gap: 5px;
          }
          
          .shipping-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          
          .method-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </section>
  );
}

