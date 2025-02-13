import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import "./blogs.css";

const CardBlog = ({ blog, onBack }) => {
      const [height, setHeight] = useState(window.innerHeight);
    
    useEffect(() => {
      const updateHeight = () => {
        setHeight(window.innerHeight);
      };
      
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }, []);
  return (
    <div className="full-blog-container" style={{ height: `${height-108}px` }}>
      {/* Full Blog Page */}
      <div className="card-blog-container">
        <button className="back-button" onClick={onBack}><span><IoMdArrowRoundBack /></span> Back</button>
        <img src={blog.image} alt={blog.title} className="full-blog-image" />
        <h1>{blog.title}</h1>
        <p>{blog.fullContent}</p>
      </div>
    </div>
  );
};

export default CardBlog;