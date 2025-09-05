import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";




function Home() {

  const [products, setProducts] = useState([]);
   const [showAll, setShowAll] = useState(false); 
   const navigate = useNavigate();

     
  // Add product to cumulative cart in localStorage
  const handleAddToCart = (product) => {
    // Read current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    // Check if product already exists in cart
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      // Increment quantity of existing product
      cart[existingIndex].quantity += 1;
    } else {
      // Add new product with quantity 1
      cart.push({ ...product, quantity: 1 });
    }
    // Save updated cart back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cart));
    // Navigate to AddToCart page
    navigate("/addtocart");
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pesticide-fullsite-work.onrender.com/api/products");
        setProducts(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  
  return (
  
  
  <div>
    
{/* <!-- Spinner Start --> */}
        {/* <div id="spinner" class="show w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-grow text-primary" role="status"></div>
        </div> */}
        {/* <!-- Spinner End --> */}

        {/* <!-- Topbar Start --> */}
        <div class="container-fluid topbar-top bg-primary">
            <div class="container">
                <div class="d-flex justify-content-between topbar py-2">
                    <div class="d-flex align-items-center flex-shrink-0 topbar-info">
                        <a href="#" class="me-4 text-secondary"><i class="fas fa-map-marker-alt me-2 text-dark"></i>coimbatore</a>
                        <a href="#" class="me-4 text-secondary"><i class="fas fa-phone-alt me-2 text-dark"></i>+01234567890</a>
                        <a href="#" class="text-secondary"><i class="fas fa-envelope me-2 text-dark"></i>pesticide@gmail.com</a>
                    </div>
                    <div class="text-end pe-4 me-4 border-end border-dark search-btn">
                        <div class="search-form">
                            <form method="post" action="index.html">
                                <div class="form-group">
                                    <div class="d-flex">
                                        <input type="search" class="form-control border-0 rounded-pill" name="search-input" value="" placeholder="Search Here" required=""/>
                                        <button type="submit" value="Search Now!" class="btn"><i class="fa fa-search text-dark"></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center topbar-icon">
                        <a href="#" class="me-4"><i class="fab fa-facebook-f text-dark"></i></a>
                        <a href="#" class="me-4"><i class="fab fa-twitter text-dark"></i></a>
                        <a href="#" class="me-4"><i class="fab fa-instagram text-dark"></i></a>
                        <a href="#" class=""><i class="fab fa-linkedin-in text-dark"></i></a>
                    </div>
                </div>
            </div>
        </div>
      {/* <!-- Topbar End --> */}

{/* 
  <!-- Navbar Start --> */}
        <div class="container-fluid bg-dark">
            <div class="container">
                <nav class="navbar navbar-dark navbar-expand-lg py-lg-0">
                    <a href="index.html" class="navbar-brand">
                        <h1 class="text-primary mb-0 display-5">Pest<span class="text-white">Kit</span><i class="fa fa-spider text-primary ms-2"></i></h1>
                    </a>
                    <button class="navbar-toggler bg-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span class="fa fa-bars text-dark"></span>
                    </button>
                    <div class="collapse navbar-collapse me-n3" id="navbarCollapse">
                        <div class="navbar-nav ms-auto">
                            <a href="index.html" class="nav-item nav-link active">Home</a>
                            <a href="about.html" class="nav-item nav-link">About</a>
                            <a href="service.html" class="nav-item nav-link">Services</a>
                            <a href="project.html" class="nav-item nav-link">Projects</a>
                            <div class="nav-item dropdown">
                                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                                <div class="dropdown-menu m-0 bg-primary">
                                    <a href="price.html" class="dropdown-item">Pricing Plan</a>
                                    <a href="blog.html" class="dropdown-item">Blog Post</a>
                                    <a href="team.html" class="dropdown-item">Team Members</a>
                                    <a href="testimonial.html" class="dropdown-item">Testimonial</a>
                                    <a href="404.html" class="dropdown-item">404 Page</a>
                                </div>
                            </div>
                            <a href="contact.html" class="nav-item nav-link">Contact</a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        {/* <!-- Navbar End --> */}


        {/* <!-- Carousel Start --> */}
        <div class="container-fluid carousel px-0 mb-5 pb-5">
            <div id="carouselId" class="carousel slide" data-bs-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-bs-target="#carouselId" data-bs-slide-to="0" class="active" aria-current="true" aria-label="First slide"></li>
                    <li data-bs-target="#carouselId" data-bs-slide-to="1" aria-label="Second slide"></li>
                </ol>
                <div class="carousel-inner" role="listbox">
                    <div class="carousel-item active">
                        <img src="img/carousel-2.jpg" class="img-fluid w-100" alt="First slide"></img>                        <div class="carousel-caption">
                            <div class="container carousel-content">
                                <h4 class="text-white mb-4 animated slideInDown">No 1 Pest Control Services</h4>
                                <h1 class="text-white display-1 mb-4 animated slideInDown">Enjoy Your Home Totally Pest Free</h1>
                                <a href="" class="me-2"><button type="button" class="px-5 py-3 btn btn-primary border-2 rounded-pill animated slideInDown">Read More</button></a>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="img/carousel-1.jpg" class="img-fluid w-100" alt="Second slide"></img>
                        <div class="carousel-caption">
                            <div class="container carousel-content">
                                <h4 class="text-white mb-4 animated slideInDown">No 1 Pest Control Services</h4>
                                <h1 class="text-white display-1 mb-4 animated slideInDown">Enjoy Your Home Totally Pest Free</h1>
                                <a href="" class="me-2"><button type="button" class="px-5 py-3 btn btn-primary border-2 rounded-pill animated slideInDown">Read More</button></a>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev btn btn-primary border border-2 border-start-0 border-primary" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next btn btn-primary border border-2 border-end-0 border-primary" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        {/* <!-- Carousel End --> */}

        {/* <!-- Get In Touch Start --> */}
        <div class="container-fluid py-5 wow fadeInUp" data-wow-delay=".3s">
            <div class="container py-5">
                <div class="bg-light px-4 py-5 rounded">
                    <div class="text-center">
                        <h1 class="display-5 mb-5">Find Your Pest Control Services</h1>
                    </div>
                    <form class="text-center mb-4" action="#">
                        <div class="row g-4">
                            <div class="col-xl-10 col-lg-12">
                                <div class="row g-4">
                                    <div class="col-md-6 col-xl-3">
                                        <select class="form-select p-3 border-0">
                                            <option value="Type Of Service" class="">Type Of Service</option>
                                            <option value="Pest Control-2">Pest Control-2</option>
                                            <option value="Pest Control-3">Pest Control-3</option>
                                            <option value="Pest Control-4">Pest Control-4</option>
                                            <option value="Pest Control-5">Pest Control-5</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 col-xl-3">
                                        <input type="text" class="form-control p-3 border-0" placeholder="Name" />
                                    </div>
                                    <div class="col-md-6 col-xl-3">
                                        <input type="text" class="form-control p-3 border-0" placeholder="Phone" />
                                    </div>
                                    <div class="col-md-6 col-xl-3">
                                        <input type="email" class="form-control p-3 border-0" placeholder="Email" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-2 col-lg-12">
                                <input type="button" class="btn btn-primary w-100 p-3 border-0" value="GET STARTED" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      {/* <!-- Get In Touch End --> */}\
      
<section className="shop_section layout_padding">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .shop_section { background: #f9f9f9; padding: 60px 0; font-family: 'Poppins', sans-serif; }
        .heading_container h2 { font-size: 2.5rem; font-weight: 700; color: #2c2c2c; position: relative; display: inline-block; margin-bottom: 40px; }
        .heading_container h2::after { content: ""; position: absolute; width: 60%; height: 4px; background: #ffcc00; bottom: -10px; left: 20%; border-radius: 10px; animation: glowLine 2s infinite alternate; }
        .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 992px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 576px) { .products-grid { grid-template-columns: 1fr; } }
        .box { background: #111; border: 2px solid #ffcc00; border-radius: 20px; padding: 15px; text-align: center; position: relative; box-shadow: 0 6px 20px rgba(0,0,0,0.4); transition: transform 0.4s ease, box-shadow 0.4s ease; overflow: hidden; }
        .box:hover { transform: translateY(-10px); box-shadow: 0 0 25px rgba(255,204,0,0.8); }
        .img-box { overflow: hidden; border-radius: 15px; }
        .img-box img { border-radius: 15px; transition: transform 0.5s ease; }
        .img-box:hover img { transform: scale(1.15); }
        .detail-box h6 { margin: 10px 0; font-size: 1rem; color: #ffcc00; }
        .detail-box span { color: #fff; font-weight: 600; margin-left: 6px; }
        .btn-actions { display: flex; justify-content: center; gap: 10px; margin-top: 12px; }
        .cart-btn, .buy-btn { padding: 10px 18px; border-radius: 30px; border: 2px solid #ffcc00; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease-in-out; }
        .cart-btn { background: #ffcc00; color: #111; }
        .cart-btn:hover { background: #ffd633; transform: scale(1.1); box-shadow: 0 0 15px rgba(255, 204, 0, 0.7); }
        .buy-btn { background: #111; color: #ffcc00; }
        .buy-btn:hover { background: #ffcc00; color: #111; transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 204, 0, 0.9); }
        .view-all-btn { margin-top: 40px; padding: 14px 40px; background: #111; border: 2px solid #ffcc00; border-radius: 40px; font-size: 1rem; font-weight: bold; color: #ffcc00; cursor: pointer; transition: transform 0.3s ease; }
        .view-all-btn:hover { background: #ffcc00; color: #111; transform: translateY(-5px); box-shadow: 0 0 20px rgba(255, 204, 0, 0.9); }
        @keyframes glowLine { from { box-shadow: 0 0 5px #ffcc00; } to { box-shadow: 0 0 20px #ffcc00; } }
        .out-of-stock { color: #ff4d4d; font-weight: bold; margin-top: 5px; }
        .buy-btn.disabled { background: #444; color: #888; cursor: not-allowed; box-shadow: none; transform: none; }
      `}</style>

      <div className="container">
        <div className="heading_container heading_center">
          <h2>Latest Products</h2>
        </div>

        <div className="products-grid">
          {products.slice(0, showAll ? products.length : 4).map((product, index) => (
            <div className="box" key={index}>
              <div className="img-box">
                {product.image ? (
                  <img 
                    src={`https://pesticide-fullsite-work.onrender.com${product.image}`} 
                    alt={product.name} 
                    width="250" 
                    height="250"
                  />
                ) : (
                  "No Image Available"
                )}
              </div>
              <div className="detail-box">
                <h6>{product.name}</h6>
                <h6>Price: <span>{product.price}</span></h6>
                <h6>Quantity: <span>{product.quantity}</span></h6>
                {product.quantity < 1 && <div className="out-of-stock">Out of Stock</div>}
              </div>

              <div className="btn-actions">
                <button 
  className="cart-btn" 
  onClick={() => handleAddToCart(product)} 
  disabled={product.quantity < 1}
  style={{ cursor: product.quantity < 1 ? "not-allowed" : "pointer" }}
>
  Add to Cart
</button>
                <button 
                  className={`buy-btn ${product.quantity < 1 ? "disabled" : ""}`} 
                  onClick={() => product.quantity >= 1 && navigate("/payment", { state: { product } })}
                  disabled={product.quantity < 1}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showAll && products.length > 4 && (
          <div className="btn-box">
            <button className="view-all-btn" onClick={() => setShowAll(true)}>View All Products</button>
          </div>
        )}
      </div>
    </section>


 


{/* <!-- About Start --> */}
<div className="container-fluid py-5">
  <div className="container py-5">
    <div className="row g-5">
      <div className="col-lg-6 col-md-12 wow fadeInUp" data-wow-delay=".3s">
        <div className="about-img">
          <div className="rotate-left bg-dark"></div>
          <div className="rotate-right bg-dark"></div>
          <img src="img/about-img.jpg" className="img-fluid h-100" alt="img" />
          <div className="bg-white experiences">
            <h1 className="display-3">20</h1>
            <h6 className="fw-bold">Years Of Experiences</h6>
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-md-12 wow fadeInUp" data-wow-delay=".6s">
        <div className="about-item overflow-hidden">
          <h5 className="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">
            About PestKit
          </h5>
          <h1 className="display-5 mb-2">World Best Pest Control Services Since 2008</h1>
          <p className="fs-5" style={{ textAlign: "justify" }}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiu smod
            tempor incididunt ut labore dolore magna aliqua.Quis ipsum suspen disse
            ultrices gravida Risus commodo viverra maecenas accumsan lacus vel facilisis.
          </p>
          <div className="row">
            <div className="col-3">
              <div className="text-center">
                <div
                  className="p-4 bg-dark rounded d-flex"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <i className="fas fa-city fa-4x text-primary"></i>
                </div>
                <div className="my-2">
                  <h5>Building</h5>
                  <h5>Cleaning</h5>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="text-center">
                <div
                  className="p-4 bg-dark rounded d-flex"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <i className="fas fa-school fa-4x text-primary"></i>
                </div>
                <div className="my-2">
                  <h5>Education</h5>
                  <h5>center</h5>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="text-center">
                <div
                  className="p-4 bg-dark rounded d-flex"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <i className="fas fa-warehouse fa-4x text-primary"></i>
                </div>
                <div className="my-2">
                  <h5>Warehouse</h5>
                  <h5>Cleaning</h5>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="text-center">
                <div
                  className="p-4 bg-dark rounded d-flex"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <i className="fas fa-hospital fa-4x text-primary"></i>
                </div>
                <div className="my-2">
                  <h5>Hospital</h5>
                  <h5>Cleaning</h5>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary border-0 rounded-pill px-4 py-3 mt-5"
          >
            Find Services
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
{/* <!-- About End --> */}

  {/* Services Start */}
<div className="container-fluid services py-5">
  <div className="container text-center py-5">
    <div className="text-center mb-5 wow fadeInUp" data-wow-delay=".3s">
      <h5 className="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">
        Our Services
      </h5>
      <h1 className="display-5">Common Pest Control Services</h1>
    </div>

    <div className="row g-5">
      <div
        className="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp"
        data-wow-delay=".3s"
      >
        <div className="bg-light rounded p-5 services-item">
          <div
            className="d-flex"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div className="mb-4 rounded-circle services-inner-icon">
              <i className="fa fa-spider fa-3x text-primary"></i>
            </div>
          </div>
          <h4>Spiders</h4>
          <p className="fs-5">
            Lorem ipsum dolor sit amet consectetur adipisc elit sed.
          </p>
          <button
            type="button"
            className="btn btn-primary border-0 rounded-pill px-4 py-3"
          >
            Learn More
          </button>
        </div>
      </div>

      <div
        className="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp"
        data-wow-delay=".5s"
      >
        <div className="bg-light rounded p-5 services-item">
          <div
            className="d-flex"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div className="mb-4 rounded-circle services-inner-icon">
              <i className="fa fa-spider fa-3x text-primary"></i>
            </div>
          </div>
          <h4 className="text-center">Mosquitos</h4>
          <p className="text-center fs-5">
            Lorem ipsum dolor sit amet consectetur adipisc elit sed.
          </p>
          <button
            type="button"
            className="btn btn-primary border-0 rounded-pill px-4 py-3"
          >
            Learn More
          </button>
        </div>
      </div>

      <div
        className="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp"
        data-wow-delay=".7s"
      >
        <div className="bg-light rounded p-5 services-item">
          <div
            className="d-flex"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div className="mb-4 rounded-circle services-inner-icon">
              <i className="fa fa-spider fa-3x text-primary"></i>
            </div>
          </div>
          <h4 className="text-center">Rodents</h4>
          <p className="text-center fs-5">
            Lorem ipsum dolor sit amet consectetur adipisc elit sed.
          </p>
          <button
            type="button"
            className="btn btn-primary border-0 rounded-pill px-4 py-3"
          >
            Learn More
          </button>
        </div>
      </div>

      <div
        className="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp"
        data-wow-delay=".9s"
      >
        <div className="bg-light rounded p-5 services-item">
          <div
            className="d-flex"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div className="mb-4 rounded-circle services-inner-icon">
              <i className="fa fa-spider fa-3x text-primary"></i>
            </div>
          </div>
          <h4 className="text-center">Termites</h4>
          <p className="text-center fs-5">
            Lorem ipsum dolor sit amet consectetur adipisc elit sed.
          </p>
          <button
            type="button"
            className="btn btn-primary border-0 rounded-pill px-4 py-3"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>

    <button
      type="button"
      className="btn btn-primary border-0 rounded-pill px-4 py-3 mt-4 wow fadeInUp"
      data-wow-delay=".3s"
    >
      More Services
    </button>
  </div>
</div>
{/* Services End */}

 {/* <!-- Project Start --> */}
        <div class="container-fluid py-5">
            <div class="container py-5">
                <div class="text-center mb-5 wow fadeInUp" data-wow-delay=".3s">
                    <h5 class="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">Our Project</h5>
                    <h1 class="display-5">Our recently completed projects</h1>
                </div>
                <div class="row g-5">
                    <div class="col-xxl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".3s">
                        <div class="project-item">
                            <div class="project-left bg-dark"></div>
                            <div class="project-right bg-dark"></div>
                            <img src="img/project-1.jpg" class="img-fluid h-100" alt="img" />
                            <a href="" class="fs-4 fw-bold text-center">Whole Home Sanitizing</a>
                        </div>
                    </div>
                    <div class="col-xxl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".5s">
                        <div class="project-item">
                            <div class="project-left bg-dark"></div>
                            <div class="project-right bg-dark"></div>
                            <img src="img/project-2.jpg" class="img-fluid h-100" alt="img" />
                            <a href="" class="fs-4 fw-bold text-center">Education center Cleaning</a>
                        </div>
                    </div>
                    <div class="col-xxl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".7s">
                        <div class="project-item">
                            <div class="project-left bg-dark"></div>
                            <div class="project-right bg-dark"></div>
                            <img src="img/project-3.jpg" class="img-fluid h-100" alt="img" />
                            <a href="" class="fs-4 fw-bold text-center">Warehouse Cleaning</a>
                        </div>
                    </div>
                    <div class="col-xxl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".3s">
                        <div class="project-item">
                            <div class="project-left bg-dark"></div>
                            <div class="project-right bg-dark"></div>
                            <img src="img/project-4.jpg" class="img-fluid h-100" alt="img" /> 
                            <a href="" class="fs-4 fw-bold text-center">Hospital Cleaning</a>
                        </div>
                    </div>
                    <div class="col-xxl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".5s">
                        <div class="project-item">
                            <div class="project-left bg-dark"></div>
                            <div class="project-right bg-dark"></div>
                            <img src="img/project-5.jpg" class="img-fluid h-100" alt="img" /> 
                            <a href="" class="fs-4 fw-bold text-center">Factory Cleaning</a>
                        </div>
                    </div>
                    <div class="col-xxl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".7s">
                        <div class="project-item">
                            <div class="project-left bg-dark"></div>
                            <div class="project-right bg-dark"></div>
                            <img src="img/project-6.jpg" class="img-fluid h-100" alt="img"/>
                            <a href="" class="fs-4 fw-bold text-center">Furniture Sanitizing</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Project End --> */}

 {/* <!-- Blog Start --> */}
        <div class="container-fluid py-5">
            <div class="container py-5">
                <div class="text-center mb-5 wow fadeInUp" data-wow-delay=".3s">
                    <h5 class="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">Our Blog</h5>
                    <h1 class="display-5">Latest Blog & News</h1>
                </div>
                <div class="owl-carousel blog-carousel wow fadeInUp" data-wow-delay=".5s">
                    <div class="blog-item">
                        <img src="img/blog-1.jpg" class="img-fluid w-100 rounded-top" alt="" />
                         <div class="rounded-bottom bg-light">
                            <div class="d-flex justify-content-between p-4 pb-2">
                                <span class="pe-2 text-dark"><i class="fa fa-user me-2"></i>By Admin</span>
                                <span class="text-dark"><i class="fas fa-calendar-alt me-2"></i>10 Feb, 2023</span>
                            </div>
                            <div class="px-4 pb-0">
                                <h4>How To Build A Cleaning Plan</h4>
                                <p>Lorem ipsum dolor sit amet consectur adip sed eiusmod tempor.</p>
                            </div>
                            <div class="p-4 py-2 d-flex justify-content-between bg-primary rounded-bottom blog-btn">
                                <a href="#" type="button" class="btn btn-primary border-0">Learn More</a>
                                <a href="#" class="my-auto btn-primary border-0"><i class="fa fa-comments me-2"></i>23 Comments</a>
                            </div>
                        </div>
                    </div>
                    <div class="blog-item">
                        <img src="img/blog-3.jpg" class="img-fluid w-100 rounded-top" alt="" />
                         <div class="rounded-bottom bg-light">
                            <div class="d-flex justify-content-between p-4 pb-2">
                                <span class="pe-2 text-dark"><i class="fa fa-user me-2"></i>By Admin</span>
                                <span class="text-dark"><i class="fas fa-calendar-alt me-2"></i>10 Feb, 2023</span>
                            </div>
                            <div class="px-4 pb-0">
                                <h4>How To Build A Cleaning Plan</h4>
                                <p>Lorem ipsum dolor sit amet consectur adip sed eiusmod tempor.</p>
                            </div>
                            <div class="p-4 py-2 d-flex justify-content-between bg-primary rounded-bottom blog-btn">
                                <a href="#" type="button" class="btn btn-primary border-0">Learn More</a>
                                <a href="#" class="my-auto text-dark"><i class="fa fa-comments me-2"></i>23 Comments</a>
                            </div>
                        </div>
                    </div>
                    <div class="blog-item">
                        <img src="img/blog-2.jpg" class="img-fluid w-100 rounded-top" alt="" />
                         <div class="rounded-bottom bg-light">
                            <div class="d-flex justify-content-between p-4 pb-2">
                                <span class="pe-2 text-dark"><i class="fa fa-user me-2"></i>By Admin</span>
                                <span class="text-dark"><i class="fas fa-calendar-alt me-2"></i>10 Feb, 2023</span>
                            </div>
                            <div class="px-4 pb-0">
                                <h4>How To Build A Cleaning Plan</h4>
                                <p>Lorem ipsum dolor sit amet consectur adip sed eiusmod tempor.</p>
                            </div>
                            <div class="p-4 py-2 d-flex justify-content-between bg-primary rounded-bottom blog-btn">
                                <a href="#" type="button" class="btn btn-primary border-0">Learn More</a>
                                <a href="#" class="my-auto text-dark"><i class="fa fa-comments me-2"></i>23 Comments</a>
                            </div>
                        </div>
                    </div>
                    <div class="blog-item">
                        <img src="img/blog-1.jpg" class="img-fluid w-100 rounded-top" alt="" />
                         <div class="rounded-bottom bg-light">
                            <div class="d-flex justify-content-between p-4 pb-2">
                                <span class="pe-2 text-dark"><i class="fa fa-user me-2"></i>By Admin</span>
                                <span class="text-dark"><i class="fas fa-calendar-alt me-2"></i>10 Feb, 2023</span>
                            </div>
                            <div class="px-4 pb-0">
                                <h4>How To Build A Cleaning Plan</h4>
                                <p>Lorem ipsum dolor sit amet consectur adip sed eiusmod tempor.</p>
                            </div>
                            <div class="p-4 py-2 d-flex justify-content-between bg-primary rounded-bottom blog-btn">
                                <a href="#" type="button" class="btn btn-primary border-0">Learn More</a>
                                <a href="#" class="my-auto text-dark"><i class="fa fa-comments me-2"></i>23 Comments</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Blog End --> */}

{/* Call To Action Start */}
<div
  className="container-fluid py-5 call-to-action wow fadeInUp"
  data-wow-delay=".3s"
  style={{ margin: "6rem 0" }}
>
  <div className="container">
    <div className="row g-4">
      <div className="col-lg-6">
        <img
          src="img/action.jpg"
          className="img-fluid w-100 rounded-circle p-5"
          alt="Newsletter"
        />
      </div>
      <div className="col-lg-6 my-auto">
        <div className="text-start mt-4">
          <h1 className="pb-4 text-white">
            Sign Up To Our Newsletter To Get The Latest Offers
          </h1>
        </div>
        <form method="post" action="index.html">
          <div className="form-group">
            <div className="d-flex call-btn">
              <input
                type="search"
                className="form-control py-3 px-4 w-100 border-0 rounded-0 rounded-end rounded-pill"
                name="search-input"
                placeholder="Enter Your Email Address"
                required
              />
              <button
                type="submit"
                className="btn btn-primary border-0 rounded-pill rounded rounded-start px-5"
              >
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
{/* Call To Action End */}


 {/* <!-- pricing Start --> */}

        <div class="container-fluid py-5">
            <div class="container py-5">
                <div class="text-center mb-5 wow fadeInUp" data-wow-delay=".3s">
                    <h5 class="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">Our Pricing</h5>
                    <h1 class="display-5 w-50 mx-auto">Affordable Pricing Plan For Pest Control Services</h1>
                </div>
                <div class="row g-5">
                    <div class="col-lg-4 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".3s">
                        <div class="rounded bg-light pricing-item">
                            <div class="bg-primary py-3 px-5 text-center rounded-top border-bottom border-dark">
                                <h2 class="m-0">Basic</h2>
                            </div>
                            <div class="px-4 py-5 text-center bg-primary pricing-label mb-2">
                                <h1 class="mb-0">$60<span class="text-secondary fs-5 fw-normal">/mo</span></h1>
                                <p class="mb-0">Basic Pest Control</p>
                            </div>
                            <div class="p-4 text-center fs-5">
                                <p><i class="fa fa-check text-success me-2"></i>Household pests Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Rodent Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Re-Service at No-Charge</p>
                                <p><i class="fa fa-times text-danger me-2"></i>Termite Control</p>
                                <p><i class="fa fa-times text-danger me-2"></i>Mosquito Reduction</p>
                                <button type="button" class="btn btn-primary border-0 rounded-pill px-4 py-3 mt-3">Get Started</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".5s">
                        <div class="rounded bg-light pricing-item">
                            <div class="bg-dark py-3 px-5 text-center rounded-top border-bottom border-primary">
                                <h2 class="m-0 text-primary">Standerd</h2>
                            </div>
                            <div class="px-4 py-5 text-center bg-dark pricing-label pricing-featured mb-2">
                                <h1 class="mb-0 text-primary">$80<span class="fs-5 fw-normal">/mo</span></h1>
                                <p class="mb-0 text-white">Standard Pest Control</p>
                            </div>
                            <div class="p-4 text-center fs-5">
                                <p><i class="fa fa-check text-success me-2"></i>Household pests Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Rodent Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Re-Service at No-Charge</p>
                                <p><i class="fa fa-check text-success me-2"></i>Termite Control</p>
                                <p><i class="fa fa-times text-danger me-2"></i>Mosquito Reduction</p>
                                <button type="button" class="btn btn-dark border-0 text-primary rounded-pill px-4 py-3 mt-3">Get Started</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".7s">
                        <div class="rounded bg-light pricing-item">
                            <div class="bg-primary py-3 px-5 text-center rounded-top border-bottom border-dark">
                                <h2 class="m-0">Premium</h2>
                            </div>
                            <div class="px-4 py-5 text-center bg-primary pricing-label mb-2">
                                <h1 class="mb-0">$120<span class="text-secondary fs-5 fw-normal">/mo</span></h1>
                                <p class="mb-0">Premium Pest Control</p>
                            </div>
                            <div class="p-4 text-center fs-5">
                                <p><i class="fa fa-check text-success me-2"></i>Household pests Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Rodent Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Re-Service at No-Charge</p>
                                <p><i class="fa fa-check text-success me-2"></i>Termite Control</p>
                                <p><i class="fa fa-check text-success me-2"></i>Mosquito Reduction</p>
                                <button type="button" class="btn btn-primary border-0 rounded-pill px-4 py-3 mt-3">Get Started</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Pricing End --> */}


        {/* <!-- Team Start --> */}

        <div class="container-fluid py-5">
            <div class="container py-5">
                <div class="text-center mb-5 wow fadeInUp" data-wow-delay=".3s">
                    <h5 class="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">Our Team</h5>
                    <h1 class="display-5 w-50 mx-auto">Our Team Members</h1>
                </div>
                <div class="row g-5">
                    <div class="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".3s">
                        <div class="rounded team-item">
                            <img src="img/team-1..jpg" class="img-fluid w-100 rounded-top border border-bottom-0" alt=""/>
                            <div class="team-content bg-primary text-dark text-center py-3">
                                <span class="fs-4 fw-bold">Full Name</span>
                                <p class="text-muted mb-0">Designation</p>
                            </div>
                            <div class="team-icon d-flex flex-column ">
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="btn btn-primary border-0"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".5s">
                        <div class="rounded team-item">
                            <img src="img/team-2.jpg" class="img-fluid w-100 rounded-top border border-bottom-0" alt=""/>
                            <div class="team-content bg-primary text-dark text-center py-3">
                                <span class="fs-4 fw-bold">Full Name</span>
                                <p class="text-muted mb-0">Designation</p>
                            </div>
                            <div class="team-icon d-flex flex-column ">
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="btn btn-primary border-0"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".7s">
                        <div class="rounded team-item">
                            <img src="img/team-3.jpg" class="img-fluid w-100 rounded-top border border-bottom-0" alt=""/>
                            <div class="team-content bg-primary text-dark text-center py-3">
                                <span class="fs-4 fw-bold">Full Name</span>
                                <p class="text-muted mb-0">Designation</p>
                            </div>
                            <div class="team-icon d-flex flex-column ">
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="btn btn-primary border-0"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay=".9s">
                        <div class="rounded team-item">
                            <img src="img/team-4.jpg" class="img-fluid w-100 rounded-top border border-bottom-0" alt=""/>
                            <div class="team-content bg-primary text-dark text-center py-3">
                                <span class="fs-4 fw-bold">Full Name</span>
                                <p class="text-muted mb-0">Designation</p>
                            </div>
                            <div class="team-icon d-flex flex-column ">
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="btn btn-primary border-0 mb-2"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="btn btn-primary border-0"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Team End --> */}

{/* Testimonial Start */}
<div className="container-fluid testimonial py-5">
  <div className="container py-5">
    <div className="text-center mb-5 wow fadeInUp" data-wow-delay=".3s">
      <h5 className="mb-2 px-3 py-1 text-dark rounded-pill d-inline-block border border-2 border-primary">
        Testimonial
      </h5>
      <h1 className="display-5 w-50 mx-auto">
        What Clients Say About Our Services
      </h1>
    </div>

    <div
      className="owl-carousel testimonial-carousel wow fadeInUp"
      data-wow-delay=".5s"
    >
      {/* Item 1 */}
      <div className="testimonial-item">
        <div className="testimonial-content rounded mb-4 p-4">
          <p className="fs-5 m-0">
            Lorem ipsum dolor sit amet elit, sed do eiusmod tempor ut labore
            et dolore magna aliqua. Ut enim ad minim veniam quis tempor.
          </p>
        </div>
        <div
          className="d-flex align-items-center mb-4"
          style={{ padding: "0 0 0 25px" }}
        >
          <div className="position-relative">
            <img
              src="img/testimonial-1.jpg"
              className="img-fluid rounded-circle py-2"
              alt="Client 1"
            />
            <div
              className="position-absolute"
              style={{ top: "33px", left: "-25px" }}
            >
              <i className="fa fa-quote-left rounded-pill bg-primary text-dark p-3"></i>
            </div>
          </div>
          <div className="ms-3">
            <h4 className="mb-0">Client Name</h4>
            <p className="mb-1">Profession</p>
            <div className="d-flex">
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
            </div>
          </div>
        </div>
      </div>

      {/* Item 2 */}
      <div className="testimonial-item">
        <div className="testimonial-content rounded mb-4 p-4">
          <p className="fs-5 m-0">
            Lorem ipsum dolor sit amet elit, sed do eiusmod tempor ut labore
            et dolore magna aliqua. Ut enim ad minim veniam quis tempor.
          </p>
        </div>
        <div
          className="d-flex align-items-center mb-4"
          style={{ padding: "0 0 0 25px" }}
        >
          <div className="position-relative">
            <img
              src="img/testimonial-2.jpg"
              className="img-fluid rounded-circle py-2"
              alt="Client 2"
            />
            <div
              className="position-absolute"
              style={{ top: "33px", left: "-25px" }}
            >
              <i className="fa fa-quote-left rounded-pill bg-primary text-dark p-3"></i>
            </div>
          </div>
          <div className="ms-3">
            <h4 className="mb-0">Client Name</h4>
            <p className="mb-1">Profession</p>
            <div className="d-flex">
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
            </div>
          </div>
        </div>
      </div>

      {/* Item 3 */}
      <div className="testimonial-item">
        <div className="testimonial-content rounded mb-4 p-4">
          <p className="fs-5 m-0">
            Lorem ipsum dolor sit amet elit, sed do eiusmod tempor ut labore
            et dolore magna aliqua. Ut enim ad minim veniam quis tempor.
          </p>
        </div>
        <div
          className="d-flex align-items-center mb-4"
          style={{ padding: "0 0 0 25px" }}
        >
          <div className="position-relative">
            <img
              src="img/testimonial-3.jpg"
              className="img-fluid rounded-circle py-2"
              alt="Client 3"
            />
            <div
              className="position-absolute"
              style={{ top: "33px", left: "-25px" }}
            >
              <i className="fa fa-quote-left rounded-pill bg-primary text-dark p-3"></i>
            </div>
          </div>
          <div className="ms-3">
            <h4 className="mb-0">Client Name</h4>
            <p className="mb-1">Profession</p>
            <div className="d-flex">
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
            </div>
          </div>
        </div>
      </div>

      {/* Item 4 */}
      <div className="testimonial-item">
        <div className="testimonial-content rounded mb-4 p-4">
          <p className="fs-5 m-0">
            Lorem ipsum dolor sit amet elit, sed do eiusmod tempor ut labore
            et dolore magna aliqua. Ut enim ad minim veniam quis tempor.
          </p>
        </div>
        <div
          className="d-flex align-items-center mb-4"
          style={{ padding: "0 0 0 25px" }}
        >
          <div className="position-relative">
            <img
              src="img/testimonial-4.jpg"
              className="img-fluid rounded-circle py-2"
              alt="Client 4"
            />
            <div
              className="position-absolute"
              style={{ top: "33px", left: "-25px" }}
            >
              <i className="fa fa-quote-left rounded-pill bg-primary text-dark p-3"></i>
            </div>
          </div>
          <div className="ms-3">
            <h4 className="mb-0">Client Name</h4>
            <p className="mb-1">Profession</p>
            <div className="d-flex">
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
              <small className="fas fa-star text-primary me-1"></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* Testimonial End */}


 {/* <!-- Footer Start --> */}

        <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay=".3s">
            <div class="container py-5">
                <div class="row g-4 footer-inner">
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-item">
                            <h4 class="text-white fw-bold mb-4">About PestKit.</h4>
                            <p>Nostrud exertation ullamco labor nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
                            <p class="mb-0"><a class="" href="#">PestKit </a> &copy; 2023 All Right Reserved.</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-item">
                            <h4 class="text-white fw-bold mb-4">Usefull Link</h4>
                            <div class="d-flex flex-column align-items-start">
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>About Us</a>
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Contact Us</a>
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Our Services</a>
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Terms & Condition</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-item">
                            <h4 class="text-white fw-bold mb-4">Services Link</h4>
                            <div class="d-flex flex-column align-items-start">
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Apartment Cleaning</a>
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Office Cleaning</a>
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Car Washing</a>
                                <a class="btn btn-link ps-0" href=""><i class="fa fa-check me-2"></i>Green Cleaning</a>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-item">
                            <h4 class="text-white fw-bold mb-4">Contact Us</h4>
                            <a href="" class="btn btn-link w-100 text-start ps-0 pb-3 border-bottom rounded-0"><i class="fa fa-map-marker-alt me-3"></i>123 Street, CA, USA</a>
                            <a href="" class="btn btn-link w-100 text-start ps-0 py-3 border-bottom rounded-0"><i class="fa fa-phone-alt me-3"></i>+012 345 67890</a>
                            <a href="" class="btn btn-link w-100 text-start ps-0 py-3 border-bottom rounded-0"><i class="fa fa-envelope me-3"></i>info@example.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Footer End --> */}

 {/* <!-- Copyright Start --> */}
        <div class="container-fluid copyright bg-dark py-4">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 text-center text-md-start mb-3 mb-md-0">
                        <a href="#" class="text-primary mb-0 display-6">Pest<span class="text-white">Kit</span><i class="fa fa-spider text-primary ms-2"></i></a>
                    </div>
                    <div class="col-md-4 copyright-btn text-center text-md-start mb-3 mb-md-0 flex-shrink-0">
                        <a class="btn btn-primary rounded-circle me-3 copyright-icon" href=""><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-primary rounded-circle me-3 copyright-icon" href=""><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-primary rounded-circle me-3 copyright-icon" href=""><i class="fab fa-youtube"></i></a>
                        <a class="btn btn-primary rounded-circle me-3 copyright-icon" href=""><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <div class="col-md-4 my-auto text-center text-md-end text-white">

                        Designed By <a class="border-bottom" href="https://htmlcodex.com">Mugesh kumar</a><br/>Distributed By <a class="border-bottom" href="">Wingora</a>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Copyright End --> */}
        

        {/* <!-- Back to Top --> */}
        <a href="#" class="btn btn-primary rounded-circle border-3 back-to-top"><i class="fa fa-arrow-up"></i></a>



  


 


  </div>
  
  );
}

export default Home;
