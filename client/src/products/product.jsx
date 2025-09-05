import React from 'react'
import { Link } from "react-router-dom";

function Product() {
  return (
    <div>

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

    
    
    </div>
    </div>
  )
}

export default Product