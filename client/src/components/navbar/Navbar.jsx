import { useContext, useEffect, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { SocketContext } from "../../context/SocketContext";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const increaseNotification = useNotificationStore((state) => state.increase);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, fetchNotifications]);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", () => {
        // Increment notification count when a new message is received
        increaseNotification();
      });
    }
    return () => {
      if (socket) {
        socket.off("getMessage");
      }
    };
  }, [socket, increaseNotification]);

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/favicon.png" alt="" />
          <span>DEstate</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Agents</a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img src="/menu.png" alt="" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
