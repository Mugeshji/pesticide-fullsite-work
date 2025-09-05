import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Add_products() {
  const [user, setUser] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
  });

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setUser((prevUser) => ({ ...prevUser, image: file }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("price", user.price);
    formData.append("quantity", user.quantity);
    formData.append("image", user.image);

    try {
      await axios.post("http://localhost:8000/api/product_details", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/products");
      console.log("Product added successfully");
    } catch (error) {
      console.error("Axios Error:", error);
    }
  };

  return (
    <div className="hero_area bg-black min-h-screen text-yellow-400 font-sans">
      {/* Header */}
      <header className="header_section bg-black border-b border-yellow-500">
        <nav className="navbar navbar-expand-lg custom_nav-container flex justify-between items-center px-8 py-4">
          <a className="navbar-brand text-3xl font-bold" href="index.html">
            Admin Page
          </a>
          <ul className="navbar-nav flex space-x-4 text-lg">
            <li className="nav-item active">
              <Link
                to="/add_products"
                className="nav-link hover:text-white transition-colors duration-300"
              >
                Add Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/all_products"
                className="nav-link hover:text-white transition-colors duration-300"
              >
                View Products
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Product Form Section */}
      <section className="contact_section layout_padding flex flex-col md:flex-row items-center justify-center py-12 px-6 md:px-20">
        {/* Left image */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <img
            alt="login-image"
            src="images/log.avif"
            className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 bg-yellow-500 text-black p-8 rounded-2xl shadow-2xl animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Add New Product
          </h2>
          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                onChange={inputHandler}
                className="w-full p-3 rounded-md border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="price"
                placeholder="Price"
                onChange={inputHandler}
                className="w-full p-3 rounded-md border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                onChange={inputHandler}
                className="w-full p-3 rounded-md border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all duration-300"
                required
              />
            </div>
            <div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={imageHandler}
                className="w-full p-2 border-2 border-black rounded-md cursor-pointer hover:border-yellow-600 transition-all duration-300"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-black text-yellow-500 font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Add_products;
