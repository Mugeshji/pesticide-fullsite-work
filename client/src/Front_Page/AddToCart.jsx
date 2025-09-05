import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = () => {
      try {
        const items = JSON.parse(localStorage.getItem("cartItems")) || [];
        
        // Ensure all items have proper image paths and IDs
        const processedItems = items.map(item => {
          // Handle image path
          let imagePath = item.image;
          if (imagePath && !imagePath.startsWith('http://localhost:8000') && !imagePath.startsWith('data:')) {
            imagePath = `http://localhost:8000${imagePath}`;
          }
          
          // Ensure we have both id and _id for API compatibility
          return {
            ...item,
            image: imagePath,
            _id: item._id || item.id, // Ensure _id is available for API calls
            id: item.id || item._id   // Ensure id is available for UI operations
          };
        });
        
        setCartItems(processedItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);

  const updateCartInStorage = (updatedCart) => {
    try {
      // Prepare items for storage (remove full URL to save space)
      const cartToStore = updatedCart.map(item => {
        const itemCopy = {...item};
        // Store relative path only if it's a local image
        if (itemCopy.image && itemCopy.image.startsWith('http://localhost:8000')) {
          itemCopy.image = itemCopy.image.replace('http://localhost:8000', '');
        }
        return itemCopy;
      });
      
      localStorage.setItem("cartItems", JSON.stringify(cartToStore));
      
      // Update state with proper image paths for display
      const itemsWithFullImagePath = updatedCart.map(item => ({
        ...item,
        image: item.image && !item.image.startsWith('http://localhost:8000') && !item.image.startsWith('data:')
          ? `http://localhost:8000${item.image}`
          : item.image
      }));
      
      setCartItems(itemsWithFullImagePath);
    } catch (error) {
      console.error("Error updating cart storage:", error);
    }
  };

  const handleQuantityChange = (productId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCartInStorage(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    updateCartInStorage(updatedCart);
  };

  const handleClearCart = () => {
    localStorage.removeItem("cartItems");
    setCartItems([]);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Extract numeric price (handle both string and number formats)
      const priceStr = item.price.toString();
      const numericPrice = parseFloat(priceStr.replace(/[^\d.]/g, ''));
      return total + (numericPrice * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal >= 999 ? 0 : 40;
    const tax = subtotal * 0.18;
    return subtotal + shipping + tax;
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Prepare cart items with proper structure for PaymentPage
    const checkoutItems = cartItems.map(item => {
      // Extract numeric price for calculations
      const priceStr = item.price.toString();
      const numericPrice = parseFloat(priceStr.replace(/[^\d.]/g, ''));
      
      return {
        ...item,
        // Ensure _id is available for quantity updates (API expects _id)
        _id: item._id || item.id,
        // Use numeric price for calculations
        price: numericPrice,
        // Ensure proper image path
        image: item.image && !item.image.startsWith('http://localhost:8000') && !item.image.startsWith('data:')
          ? `http://localhost:8000${item.image}`
          : item.image
      };
    });
    
    navigate("/payment", { 
      state: { 
        cartItems: checkoutItems, 
        total: calculateTotal(),
        isCartCheckout: true 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal >= 999 ? 0 : 40;
  const taxAmount = subtotal * 0.18;
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .cart_section { font-family: 'Poppins', sans-serif; background: #f9f9f9; min-height: 100vh; padding: 20px; }
        .cart-container { max-width: 1200px; margin: 0 auto; }
        .cart-header { background: linear-gradient(135deg, #111 0%, #1a1a1a 100%); color: #ffcc00; padding: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border-radius: 15px; margin-bottom: 30px; }
        .header-content { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; padding: 0 20px; }
        .back-btn { background: none; border: 2px solid #ffcc00; color: #ffcc00; padding: 10px 20px; border-radius: 25px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; font-weight: 600; }
        .back-btn:hover { background: #ffcc00; color: #111; transform: translateY(-2px); }
        .cart-title { font-size: 2rem; font-weight: 700; flex: 1; text-align: center; }
        .cart-badge { background: #ffcc00; color: #111; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; }
        .main-content { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        @media (max-width: 768px) { .main-content { grid-template-columns: 1fr; gap: 20px; } }
        .cart-items-section { background: #fff; border-radius: 15px; padding: 25px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
        .section-title { font-size: 1.5rem; font-weight: 700; color: #111; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .empty-cart { text-align: center; padding: 60px 20px; color: #666; }
        .empty-icon { width: 80px; height: 80px; margin: 0 auto 20px; color: #ccc; }
        .empty-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 10px; color: #111; }
        .empty-subtitle { font-size: 1rem; margin-bottom: 30px; }
        .continue-btn { background: #ffcc00; color: #111; border: none; padding: 15px 30px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .continue-btn:hover { background: #ffd633; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,204,0,0.4); }
        .cart-item { background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 15px; border: 2px solid transparent; transition: all 0.3s ease; position: relative; }
        .cart-item:hover { border-color: #ffcc00; box-shadow: 0 5px 20px rgba(255,204,0,0.2); }
        .item-content { display: flex; gap: 20px; align-items: center; }
        @media (max-width: 576px) { .item-content { flex-direction: column; text-align: center; } }
        .item-image { width: 120px; height: 120px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
        .item-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .item-image:hover img { transform: scale(1.1); }
        .item-details { flex: 1; min-width: 0; }
        .item-name { font-size: 1.2rem; font-weight: 600; color: #111; margin-bottom: 8px; }
        .item-price { font-size: 1.1rem; font-weight: 700; color: #ffcc00; margin-bottom: 15px; }
        .quantity-controls { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .qty-btn { background: #111; color: #ffcc00; border: 2px solid #ffcc00; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .qty-btn:hover { background: #ffcc00; color: #111; transform: scale(1.1); }
        .qty-btn:disabled { background: #ccc; color: #666; border-color: #ccc; cursor: not-allowed; transform: none; }
        .quantity-display { background: #fff; border: 2px solid #ffcc00; padding: 8px 15px; border-radius: 25px; font-weight: 600; color: #111; min-width: 60px; text-align: center; }
        .remove-btn { background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .remove-btn:hover { background: #c82333; transform: translateY(-2px); }
        .order-summary { background: #fff; border-radius: 15px; padding: 25px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); height: fit-content; position: sticky; top: 20px; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; }
        .summary-row:last-child { border-bottom: none; }
        .summary-row.total { font-size: 1.2rem; font-weight: 700; color: #111; border-top: 2px solid #ffcc00; margin-top: 15px; padding-top: 15px; }
        .summary-label { color: #666; font-weight: 500; }
        .summary-value { font-weight: 600; color: #111; }
        .checkout-btn { width: 100%; background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%); color: #111; border: none; padding: 18px; border-radius: 30px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .checkout-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,204,0,0.4); }
        .checkout-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .clear-cart-btn { width: 100%; background: transparent; border: 2px solid #dc3545; color: #dc3545; padding: 12px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 15px; }
        .clear-cart-btn:hover { background: #dc3545; color: white; }
        .free-shipping { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 10px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; text-align: center; margin-top: 15px; }
        .shipping-progress { background: #e9ecef; height: 6px; border-radius: 3px; margin: 10px 0; overflow: hidden; }
        .shipping-bar { background: linear-gradient(90deg, #ffcc00, #ffd633); height: 100%; transition: width 0.3s ease; }
        .free-text { color: #28a745; font-weight: 600; }
        .summary-divider { height: 1px; background: #eee; margin: 15px 0; }
      `}</style>

      <motion.div
        className="cart-container"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="cart-header"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="cart-badge">{cartItems.length} items</div>
          </div>
        </motion.div>

        <div className="main-content">
          <div className="cart-items-section">
            <h2 className="section-title">
              <ShoppingBag size={24} />
              Cart Items ({cartItems.length})
            </h2>

            {cartItems.length === 0 ? (
              <motion.div 
                className="empty-cart"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ShoppingBag className="empty-icon" />
                <h3 className="empty-title">Your cart is empty</h3>
                <p className="empty-subtitle">Add some products to get started</p>
                <motion.button 
                  className="continue-btn" 
                  onClick={() => navigate('/home')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Shopping
                </motion.button>
              </motion.div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="cart-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="item-content">
                      <div className="item-image">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                            }}
                          />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">₹{typeof item.price === 'number' ? item.price : item.price}</p>
                        
                        <div className="quantity-controls">
                          <motion.button 
                            className="qty-btn" 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={16} />
                          </motion.button>
                          <div className="quantity-display">{item.quantity}</div>
                          <motion.button 
                            className="qty-btn" 
                            onClick={() => handleQuantityChange(item.id, 1)}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>
                        
                        <motion.button 
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 size={16} />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {cartItems.length > 0 && (
                  <motion.button 
                    className="clear-cart-btn" 
                    onClick={handleClearCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All Items
                  </motion.button>
                )}
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <motion.div 
              className="order-summary"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="section-title">Order Summary</h2>
              
              <div className="summary-row">
                <span className="summary-label">Subtotal ({cartItems.length} items)</span>
                <span className="summary-value">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">
                  {subtotal >= 999 ? (
                    <span className="free-text">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">GST (18%)</span>
                <span className="summary-value">₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              {subtotal < 999 && (
                <>
                  <div className="shipping-progress">
                    <div 
                      className="shipping-bar" 
                      style={{width: `${(subtotal / 999) * 100}%`}}
                    ></div>
                  </div>
                  <p style={{fontSize: '0.9rem', color: '#666', textAlign: 'center'}}>
                    Add ₹{(999 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                </>
              )}

              {subtotal >= 999 && (
                <div className="free-shipping">
                  🎉 You've unlocked FREE shipping!
                </div>
              )}
              
              <motion.button 
                className="checkout-btn"
                onClick={handleProceedToCheckout}
                disabled={cartItems.length === 0}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(255, 255, 0, 0.8)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddToCart;