import {
  useState,
} from "react";

import api from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

export default function PostCard({
  post,
  onChange,
}) {
  const { user } =
    useAuth();

  const [editing, setEditing] =
    useState(false);

  const [content, setContent] =
    useState(
      post.content || ""
    );

  const [showComments, setShowComments] =
    useState(false);

  const [comment, setComment] =
    useState("");

  const [comments, setComments] =
    useState(
      post.comments || []
    );

  const [loading, setLoading] =
    useState(false);

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [shareMessage, setShareMessage] =
    useState("");

  const currentUserId =
    (
      user?.id ||
      user?._id
    )?.toString();

  const authorId =
    post.author?._id?.toString();

  const isOwner =
    currentUserId ===
    authorId;

  const isLiked =
    post.likes?.some(
      (like) =>
        (
          like?._id ||
          like
        )?.toString() ===
        currentUserId
    ) || false;

  const authorName =
    post.author?.name ||
    "Unknown User";

  const firstLetter =
    authorName
      .charAt(0)
      .toUpperCase();

  const formattedDate =
    new Date(
      post.createdAt
    ).toLocaleString(
      [],
      {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  /* =========================================
     MEDIA URL
  ========================================= */

  const mediaUrl =
    post.mediaUrl
      ? `http://localhost:5000${post.mediaUrl}`
      : null;

  /* =========================================
     LIKE
  ========================================= */

  async function handleLike() {
    if (loading) return;

    try {
      setLoading(true);

      await api.put(
        `/posts/${post._id}/like`
      );

      await onChange();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Unable to like post."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     DELETE
  ========================================= */

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) return;

    try {
      await api.delete(
        `/posts/${post._id}`
      );

      await onChange();
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Could not delete post."
      );
    }
  }

  /* =========================================
     UPDATE
  ========================================= */

  async function handleSave() {
    if (
      !content.trim() &&
      !post.mediaUrl
    ) {
      return;
    }

    try {
      await api.put(
        `/posts/${post._id}`,
        {
          content:
            content.trim(),
        }
      );

      setEditing(false);

      await onChange();
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Could not update post."
      );
    }
  }

  /* =========================================
     SHARE
  ========================================= */

  async function handleShare() {
    const shareUrl =
      `${window.location.origin}/post/${post._id}`;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title:
            `Post by ${authorName}`,

          text:
            post.content ||
            "Check out this post",

          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      setShareMessage(
        "✓ Post link copied!"
      );

      setTimeout(() => {
        setShareMessage("");
      }, 2500);
    } catch (error) {
      console.log(
        "Share cancelled."
      );
    }
  }

  /* =========================================
     ADD COMMENT
  ========================================= */

  async function handleComment(
    event
  ) {
    event.preventDefault();

    if (!comment.trim())
      return;

    try {
      setCommentLoading(
        true
      );

      const response =
        await api.post(
          `/posts/${post._id}/comments`,
          {
            content:
              comment.trim(),
          }
        );

      setComments(
        (previous) => [
          ...previous,
          response.data
            .comment,
        ]
      );

      setComment("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to add comment."
      );
    } finally {
      setCommentLoading(
        false
      );
    }
  }

  return (
    <article className="post">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="posthead">

        <div className="post-author">

          <div className="avatar">
            {firstLetter}
          </div>

          <div className="post-author-info">

            <strong>
              {authorName}
            </strong>

            <small>
              {formattedDate}
            </small>

          </div>

        </div>

        <div className="post-menu">
          •••
        </div>

      </div>

      {/* ==================================
          CONTENT
      ================================== */}

      <div className="post-content">

        {editing ? (
          <>
            <textarea
              className="post-edit"
              value={content}
              maxLength={1000}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
            />

            <div
              style={{
                display:
                  "flex",
                gap: "8px",
                marginTop:
                  "10px",
              }}
            >

              <button
                className="primary"
                onClick={
                  handleSave
                }
              >
                Save Changes
              </button>

              <button
                className="secondary"
                onClick={() => {
                  setContent(
                    post.content ||
                    ""
                  );

                  setEditing(
                    false
                  );
                }}
              >
                Cancel
              </button>

            </div>
          </>
        ) : (
          <>
            {/* TEXT */}

            {post.content && (
              <p>
                {post.content}
              </p>
            )}

            {/* IMAGE */}

            {post.mediaType ===
              "image" &&
              mediaUrl && (
                <div
                  style={{
                    marginTop:
                      post.content
                        ? "14px"
                        : "0",
                    borderRadius:
                      "16px",
                    overflow:
                      "hidden",
                    background:
                      "#f3f4f6",
                  }}
                >
                  <img
                    src={mediaUrl}
                    alt="Post media"
                    style={{
                      display:
                        "block",
                      width:
                        "100%",
                      maxHeight:
                        "600px",
                      objectFit:
                        "cover",
                    }}
                  />
                </div>
              )}

            {/* VIDEO */}

            {post.mediaType ===
              "video" &&
              mediaUrl && (
                <div
                  style={{
                    marginTop:
                      post.content
                        ? "14px"
                        : "0",
                    borderRadius:
                      "16px",
                    overflow:
                      "hidden",
                    background:
                      "#000",
                  }}
                >
                  <video
                    src={mediaUrl}
                    controls
                    preload="metadata"
                    style={{
                      display:
                        "block",
                      width:
                        "100%",
                      maxHeight:
                        "600px",
                    }}
                  />
                </div>
              )}
          </>
        )}

      </div>

      {/* ==================================
          ACTIONS
      ================================== */}

      {!editing && (
        <>
          <div className="post-actions">

            <button
              className={`post-action ${
                isLiked
                  ? "liked"
                  : ""
              }`}
              onClick={
                handleLike
              }
              disabled={
                loading
              }
            >
              {isLiked
                ? "♥"
                : "♡"}{" "}
              {post.likes
                ?.length || 0}
            </button>

            <button
              className="post-action"
              onClick={() =>
                setShowComments(
                  !showComments
                )
              }
            >
              💬 Comment
            </button>

            <button
              className="post-action"
              onClick={
                handleShare
              }
            >
              ↗ Share
            </button>

            {isOwner && (
              <>
                <button
                  className="post-action"
                  onClick={() =>
                    setEditing(
                      true
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="post-action delete"
                  onClick={
                    handleDelete
                  }
                >
                  Delete
                </button>
              </>
            )}

          </div>

          {/* SHARE MESSAGE */}

          {shareMessage && (
            <div className="share-message">
              {shareMessage}
            </div>
          )}

          {/* ==================================
              COMMENTS
          ================================== */}

          {showComments && (
            <div className="comments-section">

              <div className="comments-title">
                Comments
              </div>

              {comments.length ===
              0 ? (
                <div className="no-comments">
                  No comments yet.
                  Be the first!
                </div>
              ) : (
                comments.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="comment"
                      key={
                        item._id ||
                        index
                      }
                    >

                      <div className="comment-avatar">
                        {(
                          item.user
                            ?.name ||
                          "U"
                        )
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </div>

                      <div className="comment-body">

                        <strong>
                          {item.user
                            ?.name ||
                            "User"}
                        </strong>

                        <p>
                          {
                            item.content
                          }
                        </p>

                      </div>

                    </div>
                  )
                )
              )}

              <form
                className="comment-form"
                onSubmit={
                  handleComment
                }
              >

                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) =>
                    setComment(
                      e.target.value
                    )
                  }
                />

                <button
                  className="primary"
                  type="submit"
                  disabled={
                    commentLoading
                  }
                >
                  {commentLoading
                    ? "..."
                    : "Post"}
                </button>

              </form>

            </div>
          )}

        </>
      )}

    </article>
  );
}