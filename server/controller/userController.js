// controllers/productUserController.js

import { User, Product } from "../model/userModel.js";
import multer from "multer";
import path from "path";

// ==================== MULTER CONFIGURATION ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({ storage }).single("image");

// ==================== HELPERS ====================
const toNumberOrNull = (val) => {
  if (val === undefined || val === null) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
};

const toPositiveIntOrNull = (val) => {
  const n = Number(val);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  return i > 0 ? i : null;
};

// ==================== PRODUCT CONTROLLERS ====================
export const create = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name) return res.status(400).json({ message: "Product name is required" });

    const priceNum = toNumberOrNull(price);
    const qtyNum = toPositiveIntOrNull(quantity);

    if (priceNum === null || priceNum < 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }
    if (qtyNum === null) {
      return res.status(400).json({ message: "Valid positive quantity is required" });
    }

    const productExist = await Product.findOne({ name: name.trim() });
    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const newProduct = new Product({
      name: name.trim(),
      price: priceNum,
      quantity: qtyNum,
      image,
    });

    const saveData = await newProduct.save();
    res.status(200).json(saveData);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    if (updatedData.price !== undefined) {
      const p = toNumberOrNull(updatedData.price);
      if (p === null || p < 0) return res.status(400).json({ message: "Invalid price" });
      updatedData.price = p;
    }

    if (updatedData.quantity !== undefined) {
      const q = Number(updatedData.quantity);
      if (!Number.isInteger(q) || q < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      updatedData.quantity = q;
    }

    if (updatedData.name !== undefined) {
      updatedData.name = String(updatedData.name).trim();
      if (!updatedData.name) {
        return res.status(400).json({ message: "Invalid product name" });
      }
    }

    const productExist = await Product.findById(id);
    if (!productExist) return res.status(404).json({ message: "Product not found." });

    const updatedproduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: "Product Updated successfully.", updatedproduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const productData = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(productData || []);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findById(id);
    if (!productExist) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(productExist);
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findById(id);
    if (!productExist) return res.status(404).json({ message: "Product not found." });

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

// ==================== ORDER CONTROLLER ====================
export const orderProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const rawQty = req.body?.qty ?? req.query?.qty;
    const qty = toPositiveIntOrNull(rawQty);

    if (qty === null) {
      return res.status(400).json({ message: "Invalid quantity. Must be positive integer." });
    }

    const updated = await Product.findOneAndUpdate(
      { _id: id, quantity: { $gte: qty } },
      { $inc: { quantity: -qty } },
      { new: true }
    );

    if (!updated) {
      const exists = await Product.exists({ _id: id });
      if (!exists) return res.status(404).json({ message: "Product not found" });
      return res.status(400).json({ message: "Out of Stock" });
    }

    return res.status(200).json({
      message: "Order successful",
      product: updated,
      orderedQty: qty,
      remainingQty: updated.quantity,
    });
  } catch (error) {
    console.error("Order Product Error:", error);
    return res.status(500).json({
      message: "Something went wrong while updating quantity",
      errorMessage: error.message || "Internal server error",
    });
  }
};

// ==================== FIXED UPDATE QUANTITY ====================
export const updateProductQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { quantity: quantity } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Quantity updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error in updateProductQuantity:", error.message);
    res.status(500).json({ message: "Something went wrong while updating quantity" });
  }
};

// ==================== USER CONTROLLERS ====================
export const reguser = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();

    const userExist = await User.findOne({ email: normalizedEmail });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name: normalizedName,
      email: normalizedEmail,
      phone,
      address,
      password,
    });

    const saveData = await newUser.save();
    res.status(200).json(saveData);
  } catch (error) {
    console.error("Register User Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // ✅ Direct admin check (no DB required for admin)
    if (normalizedEmail === "admin@gmail.com" && password === "admin") {
      return res.status(200).json({
        message: "Admin login successful",
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin",
      });
    }

    // Normal user flow
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      role: "user",
    });
  } catch (error) {
    console.error("Login User Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find().sort({ createdAt: -1 });
    res.status(200).json(userData || []);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) return res.status(404).json({ message: "User not found." });

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ errorMessage: error.message || "Internal server error" });
  }
};
