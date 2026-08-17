import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../services/api";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    try {
      const response =
        await api.get("/posts");

      setPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts =
    posts.filter((post) => {
      const text =
        `${post.content} ${
          post.author?.name || ""
        }`.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  return (
    <>
      <Navbar />

      <main
        className="feed"
        style={{
          width:
            "min(720px, calc(100% - 32px))",
          margin:
            "35px auto 70px",
        }}
      >

        <div className="feed-header">

          <div>

            <h1>
              Explore
            </h1>

            <span>
              Discover posts and
              conversations
            </span>

          </div>

        </div>

        {/* SEARCH */}

        <div
          className="card"
          style={{
            padding: "15px",
            marginBottom: "20px",
          }}
        >

          <input
            type="text"
            placeholder="Search posts, people or topics..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              margin: 0,
            }}
          />

        </div>

        {/* TOPICS */}

        <div
          className="card"
          style={{
            padding: "20px",
            marginBottom: "20px",
          }}
        >

          <strong
            style={{
              fontFamily:
                "Space Grotesk",
              fontSize: "17px",
            }}
          >
            Popular Topics
          </strong>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "15px",
            }}
          >

            {[
              "#ReactJS",
              "#JavaScript",
              "#WebDevelopment",
              "#AI",
              "#MongoDB",
              "#StudentProjects",
            ].map((topic) => (
              <button
                key={topic}
                className="secondary"
                onClick={() =>
                  setSearch(
                    topic.replace("#", "")
                  )
                }
              >
                {topic}
              </button>
            ))}

          </div>

        </div>

        {/* POSTS */}

        {loading ? (
          <div className="empty">
            Loading explore...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty">

            <div className="empty-icon">
              🔍
            </div>

            <strong>
              No posts found
            </strong>

            <span>
              Try another search term.
            </span>

          </div>
        ) : (
          filteredPosts.map(
            (post) => (
              <PostCard
                key={post._id}
                post={post}
                onChange={loadPosts}
              />
            )
          )
        )}

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