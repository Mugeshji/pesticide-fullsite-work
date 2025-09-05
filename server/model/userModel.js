import mongoose from "mongoose";

// ==================== PRODUCT SCHEMA ====================
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,   // 👈 use Number instead of String for price
    required: true,
  },
  quantity: {
    type: Number,   // 👈 NEW FIELD
    required: true,
    min: 0          // no negative stock
  },
  status: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock"
  },
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Auto-update status when quantity changes
productSchema.pre("save", function (next) {
  this.status = this.quantity > 0 ? "In Stock" : "Out of Stock";
  next();
});

// ==================== USER SCHEMA ====================
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  address: {   
    type: String,
    required: true,
  },
  password: {    
    type: String,
    required: true,
    minlength: 5
  }
}, { timestamps: true });

// ==================== EXPORT MODELS ====================
export const User = mongoose.model("User", userSchema);
export const Product = mongoose.model("Product", productSchema);
