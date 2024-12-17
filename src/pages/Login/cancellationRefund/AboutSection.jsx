import React from "react";
import "./aboutus.css";

const AboutSection = () => {
  return (
    <div className="about-us-container">
      <h1 className="about-us-title">About Us</h1>
      <p className="about-us-description">
        Welcome to <span className="brand-name">ShipHere</span> where we
        redefine the shipping experience. We're here to make shipping smarter,
        simpler, and more efficient for your business.
      </p>

      <section className="about-us-section">
        <h2 className="section-title">Our Mission</h2>
        <p className="section-description">
          At <span className="brand-name"> ShipHere</span>, our mission is to
          transform the way you manage shipping. We know that every business has
          unique needs, and we’re dedicated to providing solutions that fit
          perfectly. Our goal is to simplify your shipping process, so you can
          focus on what you do best—growing your business.
        </p>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">What We Offer</h2>
        <ul className="offer-list">
          <li>
            Custom Shipping Rates: Get tailored shipping solutions with our
            custom pricing model. Configure rates based on zones, weight
            categories, and delivery partners to fit your exact needs.
          </li>
          <li>
            Streamlined Management: Handle all your shipping tasks from one
            easy-to-use platform. Track orders, manage delivery partners, and
            handle bulk uploads with ease.
          </li>
          <li>
            Shopify Integration: Automate your order fulfillment with our
            seamless Shopify integration. Simply click ‘Ship Now’ and watch your
            orders fulfill automatically, saving you valuable time.
          </li>
          <li>
            Precision Calculations: Our advanced algorithms ensure accurate
            shipping cost calculations, considering every factor to give you the
            best rates.
          </li>
        </ul>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <ul className="benefits-list">
          <li>
            Tailored for You: Our solutions are designed to meet your specific
            needs, whether you're a small business or a large enterprise.
          </li>
          <li>
            Reliable & Efficient: Experience a platform built for reliability
            and efficiency, ensuring smooth shipping processes every time.
          </li>
          <li>
            Dedicated Support: Our expert team is here to help you every step of
            the way. From setup to ongoing support, we’re committed to your
            success.
          </li>
        </ul>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">Join Us</h2>
        <p className="section-description">
          Discover a better way to handle shipping with{" "}
          <span className="brand-name">ShipHere</span>. Join countless
          businesses that have elevated their shipping processes with our
          innovative solutions.
        </p>
        <p className="section-description">
          Thank you for choosing us as your shipping partner. We’re excited to
          help your business thrive.
        </p>
      </section>
    </div>
  );
};

export default AboutSection;
