import React, { useState, useEffect } from "react";
import "./blogs.css";
import CardBlog from "./CardBlog";
import blogData from "./blogs";
import logo from "../../utils/logo.png";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div style={{ height: `${height}px` }}>
      <div className="nav-container">
        <nav className="navbar">
          <img src={logo} alt="logo" />
          <h2>Blog Site</h2>
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </nav>
      </div>

      {/* If a blog is selected, show the full blog */}
      {selectedBlog ? (
        <CardBlog blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
      ) : (
        <div className="blog-container">
          {blogData.map((blog) => (
            <div
              key={blog.id}
              className="blog-card"
              onClick={() => setSelectedBlog(blog)}
            >
              <img src={blog.image} alt="image" className="logo-img" />
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
              <button>Read More</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
