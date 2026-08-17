import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const [posts, setPosts] =
    useState([]);

  const [content, setContent] =
    useState("");

  const [media, setMedia] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [posting, setPosting] =
    useState(false);

  const [error, setError] =
    useState("");

  const userName =
    user?.name || "User";

  const firstLetter =
    userName
      .charAt(0)
      .toUpperCase();

  /* =========================================
     LOAD POSTS
  ========================================= */

  async function loadPosts() {
    try {
      setError("");

      const response =
        await api.get("/posts");

      setPosts(response.data);
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Unable to load your feed."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  /* =========================================
     SELECT MEDIA
  ========================================= */

  function handleMediaChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    /* Maximum 50MB */

    if (
      file.size >
      50 * 1024 * 1024
    ) {
      setError(
        "File is too large. Maximum size is 50MB."
      );

      event.target.value = "";
      return;
    }

    const isImage =
      file.type.startsWith(
        "image/"
      );

    const isVideo =
      file.type.startsWith(
        "video/"
      );

    if (!isImage && !isVideo) {
      setError(
        "Please select an image or video."
      );

      event.target.value = "";
      return;
    }

    setError("");

    setMedia(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview({
      url: objectUrl,
      type: isImage
        ? "image"
        : "video",
    });
  }

  /* =========================================
     REMOVE MEDIA
  ========================================= */

  function removeMedia() {
    if (preview?.url) {
      URL.revokeObjectURL(
        preview.url
      );
    }

    setMedia(null);
    setPreview(null);
  }

  /* =========================================
     CREATE POST
  ========================================= */

  async function handleCreatePost(
    event
  ) {
    event.preventDefault();

    if (
      !content.trim() &&
      !media
    ) {
      setError(
        "Write something or upload an image/video."
      );

      return;
    }

    try {
      setPosting(true);
      setError("");

      const formData =
        new FormData();

      if (content.trim()) {
        formData.append(
          "content",
          content.trim()
        );
      }

      if (media) {
        formData.append(
          "media",
          media
        );
      }

      await api.post(
        "/posts",
        formData
      );

      setContent("");

      removeMedia();

      await loadPosts();
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to create post."
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="home-layout">

        {/* ==================================
            LEFT SIDEBAR
        ================================== */}

        <aside className="sidebar">

          <div className="card sidebar-card">

            <div className="sidebar-profile">

              <div className="sidebar-user">

                <div className="sidebar-avatar">
                  {firstLetter}
                </div>

                <div>
                  <strong>
                    {userName}
                  </strong>

                  <span>
                    @{userName
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        ""
                      )}
                  </span>
                </div>

              </div>

            </div>

            <Link
              to="/"
              className="sidebar-link active"
            >
              <span className="sidebar-icon">
                ⌂
              </span>

              Home
            </Link>

            <Link
              to="/explore"
              className="sidebar-link"
            >
              <span className="sidebar-icon">
                ⌕
              </span>

              Explore
            </Link>

            <Link
              to="/notifications"
              className="sidebar-link"
            >
              <span className="sidebar-icon">
                ♡
              </span>

              Notifications
            </Link>

            <Link
              to="/profile"
              className="sidebar-link"
            >
              <span className="sidebar-icon">
                ◯
              </span>

              My Profile
            </Link>

          </div>

        </aside>

        {/* ==================================
            MAIN FEED
        ================================== */}

        <main className="feed">

          <div className="feed-header">

            <div>

              <h1>
                Home Feed
              </h1>

              <span>
                See what's happening
                around you
              </span>

            </div>

          </div>

          {/* ==================================
              CREATE POST
          ================================== */}

          <section className="card composer">

            <div className="composer-top">

              <div className="composer-avatar">
                {firstLetter}
              </div>

              <div className="composer-title">

                <strong>
                  {userName}
                </strong>

                <span>
                  Share something
                  with your community
                </span>

              </div>

            </div>

            <form
              onSubmit={
                handleCreatePost
              }
            >

              <textarea
                placeholder="What's on your mind?"
                value={content}
                maxLength={1000}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
              />

              {/* ==================================
                  MEDIA PREVIEW
              ================================== */}

              {preview && (
                <div
                  style={{
                    position:
                      "relative",
                    marginTop:
                      "14px",
                    borderRadius:
                      "16px",
                    overflow:
                      "hidden",
                    background:
                      "#f4f4f5",
                  }}
                >

                  <button
                    type="button"
                    onClick={
                      removeMedia
                    }
                    style={{
                      position:
                        "absolute",
                      right: "10px",
                      top: "10px",
                      zIndex: 5,
                      border: "none",
                      borderRadius:
                        "50%",
                      width: "34px",
                      height: "34px",
                      cursor:
                        "pointer",
                      background:
                        "rgba(0,0,0,.7)",
                      color: "white",
                      fontSize:
                        "18px",
                    }}
                  >
                    ×
                  </button>

                  {preview.type ===
                  "image" ? (
                    <img
                      src={
                        preview.url
                      }
                      alt="Preview"
                      style={{
                        display:
                          "block",
                        width:
                          "100%",
                        maxHeight:
                          "420px",
                        objectFit:
                          "contain",
                      }}
                    />
                  ) : (
                    <video
                      src={
                        preview.url
                      }
                      controls
                      style={{
                        display:
                          "block",
                        width:
                          "100%",
                        maxHeight:
                          "420px",
                      }}
                    />
                  )}

                </div>
              )}

              <div className="composer-bottom">

                <div
                  style={{
                    display:
                      "flex",
                    gap: "10px",
                    alignItems:
                      "center",
                    flexWrap:
                      "wrap",
                  }}
                >

                  {/* IMAGE */}

                  <label
                    htmlFor="image-upload"
                    style={{
                      cursor:
                        "pointer",
                      padding:
                        "9px 14px",
                      borderRadius:
                        "10px",
                      background:
                        "#f3f4f6",
                      fontWeight:
                        "600",
                      fontSize:
                        "14px",
                    }}
                  >
                    🖼️ Photo
                  </label>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleMediaChange
                    }
                    style={{
                      display:
                        "none",
                    }}
                  />

                  {/* VIDEO */}

                  <label
                    htmlFor="video-upload"
                    style={{
                      cursor:
                        "pointer",
                      padding:
                        "9px 14px",
                      borderRadius:
                        "10px",
                      background:
                        "#f3f4f6",
                      fontWeight:
                        "600",
                      fontSize:
                        "14px",
                    }}
                  >
                    🎥 Video
                  </label>

                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={
                      handleMediaChange
                    }
                    style={{
                      display:
                        "none",
                    }}
                  />

                  {media && (
                    <span
                      style={{
                        fontSize:
                          "13px",
                        color:
                          "#6b7280",
                      }}
                    >
                      {media.name}
                    </span>
                  )}

                </div>

                <button
                  className="primary"
                  disabled={
                    posting
                  }
                  type="submit"
                >
                  {posting
                    ? "Publishing..."
                    : "Publish Post"}
                </button>

              </div>

            </form>

          </section>

          {/* ==================================
              ERROR
          ================================== */}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* ==================================
              POSTS
          ================================== */}

          {loading ? (
            <div className="empty">

              <div className="empty-icon">
                ◌
              </div>

              <strong>
                Loading your feed...
              </strong>

              <span>
                Please wait a moment.
              </span>

            </div>
          ) : posts.length ===
            0 ? (
            <div className="empty">

              <div className="empty-icon">
                ✦
              </div>

              <strong>
                Your feed is empty
              </strong>

              <span>
                Be the first person
                to share something!
              </span>

            </div>
          ) : (
            posts.map(
              (post) => (
                <PostCard
                  key={
                    post._id
                  }
                  post={post}
                  onChange={
                    loadPosts
                  }
                />
              )
            )
          )}

        </main>

        {/* ==================================
            RIGHT SIDEBAR
        ================================== */}

        <aside className="trending">

          <div className="card trending-card">

            <h3 className="trending-title">
              Trending Today
            </h3>

            <div className="trend">
              <span>
                Trending topic
              </span>

              <strong>
                #WebDevelopment
              </strong>
            </div>

            <div className="trend">
              <span>
                Popular
              </span>

              <strong>
                #ReactJS
              </strong>
            </div>

            <div className="trend">
              <span>
                Community
              </span>

              <strong>
                #StudentProjects
              </strong>
            </div>

            <div className="trend">
              <span>
                Technology
              </span>

              <strong>
                #AI
              </strong>
            </div>

          </div>

        </aside>

      </div>

      {/* ==================================
          MOBILE NAVIGATION
      ================================== */}

      <div className="mobile-nav">

        <NavLink to="/">
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