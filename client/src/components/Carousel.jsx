import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Carousel() {
  return (
    <div className="container-fluid p-0 mb-5">
      <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">

          {/* First Slide */}
          <div className="carousel-item active">
            <img className="w-100" src="img/carousel-1.jpg" alt="First slide" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{ maxWidth: "900px" }}>
                <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                  Creative & Innovative
                </h5>
                <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                  Creative & Innovative Digital Solution
                </h1>
                <a href="" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">
                  Free Quote
                </a>
                <a href="" className="btn btn-light py-md-3 px-md-5 animated slideInRight">
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Second Slide */}
          <div className="carousel-item">
            <img className="w-100" src="img/carousel-2.jpg" alt="Second slide" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{ maxWidth: "900px" }}>
                <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                  Creative & Innovative
                </h5>
                <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                  Creative & Innovative Digital Solution
                </h1>
                <a href="" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">
                  Free Quote
                </a>
                <a href="" className="btn btn-light py-md-3 px-md-5 animated slideInRight">
                  Contact Us
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}
