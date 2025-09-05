import express from "express";
import multer from "multer";
import path from "path";

import { 
  create, 
  reguser, 
  loginUser , 
  getAllUsers, 
  getAllProducts, 
  update, 
  deleteUser , 
  getProductById, 
  deleteProduct,
  orderProduct,
  updateProductQuantity   // ✅ controller for updating quantity
} from "../controller/userController.js";

const route = express.Router();

// ==================== MULTER STORAGE CONFIGURATION ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ==================== ROUTES ====================

// 📌 PRODUCT ROUTES
route.post("/product_details", upload.single("image"), create);
route.get("/products", getAllProducts);
route.get("/product/:id", getProductById);
route.put("/update/product/:id", upload.single("image"), update);
route.delete("/delete/product/:id", deleteProduct);

// 📌 ORDER ROUTES
route.post("/order/:id", orderProduct); 

// 🔥 Quantity update route matching frontend call
route.put("/update-quantity/:id", updateProductQuantity);  

// 📌 USER ROUTES
route.get("/users", getAllUsers);
route.post("/userreg", reguser);
route.post("/login", loginUser );
route.delete("/delete/user/:id", deleteUser );

export default route;
