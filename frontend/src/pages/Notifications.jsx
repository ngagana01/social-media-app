import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      icon: "♥",
      title: "Welcome to ConnectHub",
      message:
        "Your notifications will appear here when people interact with your posts.",
      time: "Now",
    },
    {
      id: 2,
      icon: "💬",
      title: "Stay connected",
      message:
        "Create a post and start a conversation with your community.",
      time: "Today",
    },
    {
      id: 3,
      icon: "✦",
      title: "Discover new content",
      message:
        "Visit Explore to find interesting posts and topics.",
      time: "Today",
    },
  ];

  return (
    <>
      <Navbar />

      <main
        style={{
          width:
            "min(720px, calc(100% - 32px))",
          margin:
            "35px auto 80px",
        }}
      >

        <div className="feed-header">

          <div>

            <h1>
              Notifications
            </h1>

            <span>
              Stay updated with your
              ConnectHub activity
            </span>

          </div>

        </div>

        <div
          className="card"
          style={{
            overflow: "hidden",
          }}
        >

          {notifications.map(
            (notification) => (
              <div
                key={notification.id}
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "20px",
                  borderBottom:
                    "1px solid var(--border)",
                }}
              >

                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    minWidth: "44px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "var(--primary-light)",
                    color:
                      "var(--primary)",
                    fontSize: "18px",
                  }}
                >
                  {notification.icon}
                </div>

                <div
                  style={{
                    flex: 1,
                  }}
                >

                  <strong
                    style={{
                      display: "block",
                      fontSize: "14px",
                    }}
                  >
                    {notification.title}
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0",
                      color:
                        "var(--text-secondary)",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </p>

                  <small
                    style={{
                      color:
                        "var(--text-light)",
                    }}
                  >
                    {notification.time}
                  </small>

                </div>

              </div>
            )
          )}

        </div>

      </main>

      <div className="mobile-nav">

        <NavLink to="/" end>
          <span className="mobile-nav-icon">
            ⌂
          </span>
          Home
        </NavLink>

        <NavLink to="/explore">
          <span className="mobile-nav-icon">
            ⌕
          </span>
          Explore
        </NavLink>

        <NavLink to="/notifications">
          <span className="mobile-nav-icon">
            ♡
          </span>
          Alerts
        </NavLink>

        <NavLink to="/profile">
          <span className="mobile-nav-icon">
            ◯
          </span>
          Profile
        </NavLink>

      </div>
    </>
  );
}