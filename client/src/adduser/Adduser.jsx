import React, { useState } from "react";
import "./Adduser.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Adduser = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    image: null, // Store file object
  });

  const navigate = useNavigate();

  // **Handle text input changes**
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // **Handle image file selection**
  const imageHandler = (e) => {
    const file = e.target.files[0]; // Get the selected file (first file if multiple are selected)
    setUser((prevUser) => ({ ...prevUser, image: file })); // Update user state with the file
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(); // .append("key", value) adds each field to the FormData object.
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("address", user.address);
    formData.append("image", user.image);  // Ensure file is sent correctly

    try {
        await axios.post("http://localhost:8000/api/user", formData, {
            headers: { "Content-Type": "multipart/form-data" } // The Content-Type: multipart/form-data header 
            // ensures the request properly transmits the file and text data.
        });
        navigate("/");
        console.log("User added successfully");
    } catch (error) {
        console.error("Axios Error:", error);
    }
};
  return (
    <div className="addUser">
      <Link to="/" type="button" className="btn btn-primary">
        Back
      </Link>
      <h3>Add new user</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label>Name:</label>
          <input type="text" name="name" autoComplete="off" onChange={inputHandler} placeholder="Enter your name" />
        </div>
        <div className="inputGroup">
          <label>Email:</label>
          <input type="text" name="email" autoComplete="off" onChange={inputHandler} placeholder="Enter your email" />
        </div>
        <div className="inputGroup">
          <label>Address:</label>
          <input type="text" name="address" autoComplete="off" onChange={inputHandler} placeholder="Enter your address" />
        </div>
        <div className="inputGroup">
          <label>Upload photo:</label>
          <input type="file" name="image" autoComplete="off" onChange={imageHandler} />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Adduser;
