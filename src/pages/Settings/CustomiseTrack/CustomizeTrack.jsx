import React, { useState } from "react";
import axios from "axios";
import "./customiseTracking.css"; // Add a CSS file for styling

function CustomizeTrack() {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [charCount, setCharCount] = useState(0);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImages(files);

    // Generate preview URLs
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(fileUrls);
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;

    // Check if the text length is within the limit
    if (text.length <= 100) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0 || !description || !url) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    console.log("image", images);
    console.log("description", description);
    formData.append("description", description);
    console.log("url", url);
    formData.append("url", url);
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/customiseTrack/create-advertisement",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Advertisement uploaded successfully!");
      setImages([]);
      setDescription("");
      setUrl("");
      setPreviewUrls([]);
      setCharCount(0); // Reset character count
    } catch (error) {
      console.error(error);
      alert("Error uploading advertisement.");
    }
  };

  return (
    <div className="customize-track-container">
      <h2 className="customize-track-title">Customize Your Advertisement</h2>
      <form onSubmit={handleSubmit} className="customize-track-form">
        <div className="form-group">
          <label className="form-label">Upload Images (Max 3):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="form-input"
          />
        </div>
        {previewUrls.length > 0 && (
          <div className="image-preview-container">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="image-preview"
              />
            ))}
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter a brief description"
            className="form-textarea"
            rows={2}
            required
          />
          <div className="char-count">{charCount} / 100 characters</div>
        </div>
        <div className="form-group">
          <label className="form-label">URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the URL"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CustomizeTrack;
