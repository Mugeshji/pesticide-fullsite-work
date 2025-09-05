import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Services() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="text-primary text-uppercase">// Our Services //</h6>
          <h1 className="mb-5">Explore Our Services</h1>
        </div>
        <div className="row g-4">

          {/* Service Item 1 */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="service-item bg-light rounded h-100 p-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded mb-4"
                   style={{ width: "60px", height: "60px" }}>
                <i className="fa fa-code text-white fs-4"></i>
              </div>
              <h4 className="mb-3">Web Development</h4>
              <p className="mb-4">
                We build modern, responsive, and high-performance websites tailored to your business needs.
              </p>
              <a className="btn" href="">
                <i className="fa fa-plus text-primary me-3"></i>Read More
              </a>
            </div>
          </div>

          {/* Service Item 2 */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <div className="service-item bg-light rounded h-100 p-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded mb-4"
                   style={{ width: "60px", height: "60px" }}>
                <i className="fa fa-mobile-alt text-white fs-4"></i>
              </div>
              <h4 className="mb-3">App Development</h4>
              <p className="mb-4">
                We create powerful, user-friendly mobile applications for Android and iOS platforms.
              </p>
              <a className="btn" href="">
                <i className="fa fa-plus text-primary me-3"></i>Read More
              </a>
            </div>
          </div>

          {/* Service Item 3 */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
            <div className="service-item bg-light rounded h-100 p-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded mb-4"
                   style={{ width: "60px", height: "60px" }}>
                <i className="fa fa-chart-line text-white fs-4"></i>
              </div>
              <h4 className="mb-3">Digital Marketing</h4>
              <p className="mb-4">
                Our digital marketing strategies help your brand reach the right audience effectively.
              </p>
              <a className="btn" href="">
                <i className="fa fa-plus text-primary me-3"></i>Read More
              </a>
            </div>
          </div>

          {/* Service Item 4 */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
            <div className="service-item bg-light rounded h-100 p-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded mb-4"
                   style={{ width: "60px", height: "60px" }}>
                <i className="fa fa-paint-brush text-white fs-4"></i>
              </div>
              <h4 className="mb-3">UI/UX Design</h4>
              <p className="mb-4">
                We design visually stunning and user-friendly interfaces that enhance user experience.
              </p>
              <a className="btn" href="">
                <i className="fa fa-plus text-primary me-3"></i>Read More
              </a>
            </div>
          </div>

          {/* Service Item 5 */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.9s">
            <div className="service-item bg-light rounded h-100 p-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded mb-4"
                   style={{ width: "60px", height: "60px" }}>
                <i className="fa fa-cloud text-white fs-4"></i>
              </div>
              <h4 className="mb-3">Cloud Solutions</h4>
              <p className="mb-4">
                We provide scalable and secure cloud services for storage, hosting, and applications.
              </p>
              <a className="btn" href="">
                <i className="fa fa-plus text-primary me-3"></i>Read More
              </a>
            </div>
          </div>

          {/* Service Item 6 */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="1.1s">
            <div className="service-item bg-light rounded h-100 p-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded mb-4"
                   style={{ width: "60px", height: "60px" }}>
                <i className="fa fa-lock text-white fs-4"></i>
              </div>
              <h4 className="mb-3">Cyber Security</h4>
              <p className="mb-4">
                Our cybersecurity services ensure your systems and data remain safe and protected.
              </p>
              <a className="btn" href="">
                <i className="fa fa-plus text-primary me-3"></i>Read More
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
