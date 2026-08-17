import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/posts/${id}`);

        setPost(response.data);
      } catch (err) {
        console.error(
          "Failed to load post:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load this post."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="post-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-page-message">
        <div className="message-card">
          <div className="message-icon">⚠️</div>

          <h2>Post unavailable</h2>

          <p>{error}</p>

          <button
            onClick={() => navigate("/")}
            className="back-home-btn"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-page-message">
        <div className="message-card">
          <div className="message-icon">🔍</div>

          <h2>Post not found</h2>

          <p>
            This post may have been deleted or is no
            longer available.
          </p>

          <button
            onClick={() => navigate("/")}
            className="back-home-btn"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const authorName =
    post.author?.name ||
    post.user?.name ||
    "ConnectHub User";

  const authorUsername =
    post.author?.username ||
    post.user?.username ||
    "";

  const authorImage =
    post.author?.profilePicture ||
    post.user?.profilePicture ||
    "";

  const postText =
    post.content ||
    post.description ||
    post.text ||
    "";

  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "";

  const likeCount = Array.isArray(post.likes)
    ? post.likes.length
    : post.likes || 0;

  const commentCount = Array.isArray(
    post.comments
  )
    ? post.comments.length
    : 0;

  return (
    <div className="post-details-page">
      {/* Top bar */}
      <header className="post-details-topbar">
        <button
          className="post-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <h1>Post</h1>

        <button
          className="post-home-button"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      {/* Post */}
      <main className="post-details-container">
        <article className="post-details-card">
          {/* Author */}
          <div className="post-author">
            {authorImage ? (
              <img
                src={authorImage}
                alt={authorName}
                className="post-author-image"
              />
            ) : (
              <div className="post-author-placeholder">
                {authorName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="post-author-info">
              <h3>{authorName}</h3>

              {authorUsername && (
                <span>@{authorUsername}</span>
              )}

              {createdAt && (
                <small>{createdAt}</small>
              )}
            </div>
          </div>

          {/* Content */}
          {postText && (
            <div className="post-content">
              <p>{postText}</p>
            </div>
          )}

          {/* Image */}
          {post.image && (
            <div className="post-image-container">
              <img
                src={post.image}
                alt="Post"
                className="post-details-image"
              />
            </div>
          )}

          {/* Stats */}
          <div className="post-stats">
            <span>
              ❤️ {likeCount}{" "}
              {likeCount === 1
                ? "like"
                : "likes"}
            </span>

            <span>
              💬 {commentCount}{" "}
              {commentCount === 1
                ? "comment"
                : "comments"}
            </span>
          </div>

          {/* Actions */}
          <div className="post-actions">
            <button
              type="button"
              onClick={() =>
                navigate(`/?post=${post._id}`)
              }
            >
              ❤️ Like
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/?post=${post._id}`)
              }
            >
              💬 Comment
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  window.location.href
                );

                alert(
                  "Post link copied to clipboard!"
                );
              }}
            >
              ↗ Share
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}