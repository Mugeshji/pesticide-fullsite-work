import React from "react";

export default function AboutSection() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Left Side Image */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="row g-3">
              <div className="col-6 text-start">
                <img
                  className="img-fluid rounded w-100 wow zoomIn"
                  data-wow-delay="0.1s"
                  src="https://via.placeholder.com/400x400" 
                  alt="About Us"
                />
              </div>
              <div className="col-6 text-start">
                <img
                  className="img-fluid rounded w-75 wow zoomIn"
                  data-wow-delay="0.3s"
                  src="https://via.placeholder.com/300x300"
                  style={{ marginTop: "25%" }}
                  alt="About Work"
                />
              </div>
              <div className="col-6 text-end">
                <img
                  className="img-fluid rounded w-75 wow zoomIn"
                  data-wow-delay="0.5s"
                  src="https://via.placeholder.com/300x300"
                  alt="Team Work"
                />
              </div>
              <div className="col-6 text-end">
                <img
                  className="img-fluid rounded w-100 wow zoomIn"
                  data-wow-delay="0.7s"
                  src="https://via.placeholder.com/400x400"
                  alt="Office"
                />
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
            <h6 className="section-title bg-white text-start text-primary pe-3">
              About Us
            </h6>
            <h1 className="mb-4">Welcome to Our Company</h1>
            <p className="mb-4">
              We are committed to delivering exceptional services and
              innovative solutions to our clients. With years of expertise and a
              passionate team, we provide high-quality products that drive
              growth and success.
            </p>
            <p className="mb-4">
              Our mission is to bring creativity, technology, and strategy
              together to achieve the best outcomes. We focus on customer
              satisfaction and long-term partnerships.
            </p>

            {/* Key Points */}
            <div className="row g-3 mb-4">
              <div className="col-12 d-flex">
                <div
                  className="flex-shrink-0 btn-square bg-primary rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="fa fa-check text-white"></i>
                </div>
                <div className="ms-3">
                  <h6>Trusted & Experienced</h6>
                  <span>Years of proven track record in the industry.</span>
                </div>
              </div>
              <div className="col-12 d-flex">
                <div
                  className="flex-shrink-0 btn-square bg-primary rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="fa fa-check text-white"></i>
                </div>
                <div className="ms-3">
                  <h6>Customer Centric</h6>
                  <span>We prioritize client satisfaction at every step.</span>
                </div>
              </div>
            </div>

            <a className="btn btn-primary py-3 px-5 mt-2" href="#services">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
