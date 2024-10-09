import React from 'react';
import './Home.css'; // Make sure to create this CSS file with styles

const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-heading">Welcome to Tiffin Connect!</h1>
            <p className="hero-subheading">
              Discover the best home-cooked meals delivered to your doorstep.
            </p>
            <button className="order-now-button">Order Now</button>
          </div>
        </div>
        <div className="features-section">
          <h2 className="features-heading">Why Choose Us?</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Fresh & Nutritious</h3>
              <p>Delicious, home-cooked meals made fresh every day.</p>
            </div>
            <div className="feature-item">
              <h3>Flexible Subscriptions</h3>
              <p>Subscribe for weekly or monthly meal plans that fit your schedule.</p>
            </div>
            <div className="feature-item">
              <h3>Trusted Providers</h3>
              <p>Choose from a variety of trusted tiffin providers near you.</p>
            </div>
          </div>
        </div>
        <div className="cta-section">
          <h2>Ready to Experience Homemade Goodness?</h2>
          <button className="cta-button">Explore Tiffins</button>
        </div>
      </div>
    </>
  );
};

export default Home;
