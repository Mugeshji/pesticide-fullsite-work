import React , { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
      });
    
      const navigate = useNavigate();
    
      // **Handle text input changes**
      const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
      };
    
    const submitForm = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(); // .append("key", value) adds each field to the FormData object.
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("phone", user.phone);
    
        try {
            await axios.post("http://localhost:8000/api/userreg", formData, {
              headers: { "Content-Type": "application/json" } // The Content-Type: multipart/form-data header 
                // ensures the request properly transmits the file and text data.
            });
            navigate("/");
            console.log("Registered successfully");
        } catch (error) {
            console.error("Axios Error:", error);
        }
    };

  return (
    <div>
    <section class="contact_section layout_padding">
<div class="container px-0">
 <div class="heading_container ">
   <h2 class="">
   Register
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
         <input type="text" name="name" placeholder="Name"  onChange={inputHandler} />
       </div>
       <div>
         <input type="email" name="email" placeholder="Email" onChange={inputHandler} />
       </div>
       <div>
         <input type="text" name="phone" placeholder="Phone" onChange={inputHandler} />
       </div>
    
       <div class="d-flex ">
         <button>
         Register
         </button>
       </div>
     </form>
   </div>
 </div>
</div>
</section>





</div>
  )
}

export default Register;