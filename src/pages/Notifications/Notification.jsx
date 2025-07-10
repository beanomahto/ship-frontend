import React, { useEffect, useState } from "react";
import "./notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "process.env.url/api/notifcation/getallnotifications",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);

        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="notification-container">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
        ))
      ) : (
        <div>No notifications available.</div>
      )}
    </div>
  );
};

export default Notification;
