import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Update = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
  });
  const [image, setImage] = useState(null); // Separate state for image

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

console.log(product.name)

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]); // Store the selected file
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    if (image) {
      formData.append("image", image); // Add image if selected
    }

    try {
      await axios.put(`http://localhost:8000/api/update/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/all_products");
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  return (
        <div class="hero_area">
              
                 <header class="header_section">
                   <nav class="navbar navbar-expand-lg custom_nav-container ">
                     <a class="navbar-brand" href="index.html">
                       <span>
                        Admin Page
                       </span>
                     </a>
                     <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                       <span class=""></span>
                     </button>
             
                     <div class="collapse navbar-collapse" id="navbarSupportedContent">
                       <ul class="navbar-nav  ">
                         <li class="nav-item active">
             
                        <Link to="/add_products" class="nav-link">Add products<span class="sr-only">(current)</span></Link>
                           
                         </li>
                         <li class="nav-item">
                           <Link to="/all_products" class="nav-link">View products<span class="sr-only"></span></Link>
                         </li>
                       
                       </ul>
                   
                     </div>
                   </nav>
                 </header>
             
                 
                 
                
       <section class="contact_section layout_padding">
   <div class="container px-0">
    <div class="heading_container ">
      <h2 class="">
      Products
      </h2>
    </div>
   </div>
   <div class="container container-bg">
    <div class="row">
      <div class="col-lg-7 col-md-6 px-0">
        <div class="map_container">
       <img alt="login-image" src="images/log.avif"></img>
        </div>
      </div>
      <div class="col-md-6 col-lg-5 px-0">
        <form onSubmit={submitForm}>
          <div>
            <input type="text" name="name" placeholder="Name"  value={product.name} onChange={inputHandler} />
          </div>
          <div>
            <input type="number" name="price" placeholder="Price" value={product.price} onChange={inputHandler} />
          </div>
          <div>
          <input type="file" name="image" autoComplete="off" onChange={fileHandler} />
          </div>
       
          <div class="d-flex ">
            <button>
          Update products
            </button>
          </div>
        </form>
      
      </div>
    </div>
   </div>
   </section>
   
   </div>
  );
};

export default Update;
