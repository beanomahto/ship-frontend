// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./customiseTracking.css"; // Add a CSS file for styling

// function CustomizeTrack() {
//   const [images, setImages] = useState([]);
//   const [description, setDescription] = useState("");
//   const [url, setUrl] = useState("");
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [charCount, setCharCount] = useState(0);
//   const [advertisementId, setAdvertisementId] = useState(null); // To check if ad exists

//   const token = localStorage.getItem("token");

//   // Fetch existing advertisement
//   useEffect(() => {
//     const fetchAdvertisement = async () => {
//       try {
//         const response = await axios.get(
//           "https://backend.shiphere.in/api/customiseTrack/get-advertisement",
//           {
//             headers: { Authorization: `${token}` },
//           }
//         );
//         console.log("res", response);
//         if (response.data) {
//           const {
//             _id,
//             images: existingImages,
//             description,
//             url,
//           } = response.data;
//           setAdvertisementId(_id);
//           setDescription(description);
//           setUrl(url);
//           setImages(existingImages);

//           // Generate preview URLs for existing images
//           setPreviewUrls(existingImages);
//           setCharCount(description.length);
//         }
//       } catch (error) {
//         console.log("No advertisement found for the user. You can create one.");
//       }
//     };

//     fetchAdvertisement();
//   }, [token]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 3) {
//       alert("You can only upload up to 3 images.");
//       return;
//     }
//     setImages(files);

//     const fileUrls = files.map((file) => URL.createObjectURL(file));
//     setPreviewUrls(fileUrls);
//   };

//   const handleDescriptionChange = (e) => {
//     const text = e.target.value;
//     if (text.length <= 100) {
//       setDescription(text);
//       setCharCount(text.length);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!description || !url || images.length === 0) {
//       alert("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     if (images && images.length > 0) {
//       images.forEach((image) => formData.append("images", image));
//     }
//     formData.append("description", description);
//     formData.append("url", url);

//     try {
//       if (advertisementId) {
//         // Update existing advertisement
//         await axios.put(
//           `https://backend.shiphere.in/api/customiseTrack/update-advertisement/${advertisementId}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `${token}`,
//             },
//           }
//         );
//         alert("Advertisement updated successfully!");
//       } else {
//         // Create a new advertisement
//         await axios.post(
//           "https://backend.shiphere.in/api/customiseTrack/create-advertisement",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `${token}`,
//             },
//           }
//         );
//         alert("Advertisement created successfully!");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error saving advertisement.");
//     }
//   };

//   return (
//     <div className="">
//       <div className="customize-track-container">
//         <h2 className="customize-track-title">Customize Your Advertisement</h2>
//         <form onSubmit={handleSubmit} className="customize-track-form">
//           <div className="form-group">
//             <label className="form-label">Upload Images (Max 3):</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               className="form-input"
//             />
//           </div>
//           {previewUrls.length > 0 && (
//             <div className="image-preview-container">
//               {previewUrls.map((url, index) => (
//                 <img
//                   key={index}
//                   src={typeof url === "string" ? url : URL.createObjectURL(url)}
//                   alt={`Preview ${index + 1}`}
//                   className="image-preview"
//                 />
//               ))}
//             </div>
//           )}
//           <div className="form-group">
//             <label className="form-label">Description:</label>
//             <textarea
//               value={description}
//               onChange={handleDescriptionChange}
//               placeholder="Enter a brief description"
//               className="form-textarea"
//               rows={2}
//               required
//             />
//             <div className="char-count">{charCount} / 100 characters</div>
//           </div>
//           <div className="form-group">
//             <label className="form-label">URL:</label>
//             <input
//               type="url"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               placeholder="Enter the URL"
//               className="form-input"
//               required
//             />
//           </div>
//           <button type="submit" className="form-submit-button">
//             {advertisementId ? "Update" : "Submit"}
//           </button>
//         </form>
//       </div>
//       {/* right */}
//       <div>
//         <Carousel autoplay>
//           {advertisement.images.map((imageSrc, index) => (
//             <div key={index}>
//               <a
//                 href={advertisement.url} // Use the single URL
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <img
//                   src={imageSrc} // Use each image source
//                   alt={`Advertisement ${index + 1}`}
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: "350px",
//                     height: "350px",
//                     objectFit: "cover",
//                     borderRadius: "8px",
//                   }}
//                 />
//               </a>
//             </div>
//           ))}
//         </Carousel>

//         {advertisement.description && (
//           <p
//             style={{
//               marginTop: "10px",
//               color: "#555",
//               fontSize: "20px",
//               fontWeight: "bolder",
//               marginBottom: "10px",
//             }}
//           >
//             {advertisement.description}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CustomizeTrack;
import { Carousel } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./customiseTracking.css";

function CustomizeTrack() {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [advertisement, setAdvertisement] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await axios.get(
          "process.env.url/api/customiseTrack/get-advertisement",
          { headers: { Authorization: `${token}` } }
        );
        const { images, description, url } = response.data;
        setAdvertisement(response.data);
        setDescription(description);
        setUrl(url);
        setPreviewUrls(images);
        setCharCount(description.length);
      } catch {
        console.log("No advertisement found.");
      }
    };

    fetchAdvertisement();
  }, [token]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !url || images.length === 0) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    formData.append("description", description);
    formData.append("url", url);

    try {
      if (advertisement) {
        await axios.put(
          `process.env.url/api/customiseTrack/update-advertisement/${advertisement._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );
        alert("Advertisement updated!");
      } else {
        await axios.post(
          "process.env.url/api/customiseTrack/create-advertisement",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );
        alert("Advertisement created!");
      }
    } catch (err) {
      alert("Error saving advertisement.");
    }
  };

  return (
    <div className="customize-track-layout">
      {/* Left side: Form */}
      <div className="customize-track-container">
        <h2 className="customize-track-title">Customize Your Advertisement</h2>
        <form onSubmit={handleSubmit} className="customize-track-form">
          {/* Form elements */}
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
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preview ${idx + 1}`}
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
          <div className="sub-btn">
            <button type="submit" className="form-submit-button">
              {advertisement ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Right side: Slider and Benefits */}
      <div className="right-slider">
        {/* Slider Section */}
        {advertisement && advertisement.images.length > 0 ? (
          <Carousel autoplay>
            {advertisement.images.map((imageSrc, idx) => (
              <div key={idx} className="slider-content">
                <a
                  href={advertisement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    src={imageSrc}
                    alt={`Ad ${idx + 1}`}
                    className="slider-image"
                  />
                </a>
              </div>
            ))}
          </Carousel>
        ) : (
          <div
            className="placeholder-box"
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>
              After uploading, here is how your advertisement will look like.
            </p>
          </div>
        )}
        {advertisement?.description && (
          <p className="slider-description">{advertisement.description}</p>
        )}

        {/* Benefits Section */}
        <div className="benefits-section">
          <h3 className="benefits-heading">
            🌟 No Budget? No Problem! Run Free Ads and Increase Visibility!
          </h3>
          <ul className="benefits-list">
            <li>
              <strong>🚀 Increased Brand Awareness:</strong> Making your brand
              more recognizable and familiar, which can lead to higher
              engagement, trust, and customer loyalty.
            </li>
            <li>
              <strong>💰 Better ROI:</strong> Indicates that your marketing
              efforts are effectively driving sales, leads, or other desired
              outcomes at a cost-efficient rate.
            </li>
            <li>
              <strong>📈 Sales Increase:</strong> Effective ads attract more
              customers, generate interest, and encourage purchases, leading to
              higher revenue and growth.
            </li>
            <li>
              <strong>👀 Product Visibility Benefits:</strong> Greater
              visibility helps your product stand out in a crowded market,
              attract attention, and drive awareness.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CustomizeTrack;
