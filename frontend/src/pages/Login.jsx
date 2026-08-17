// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const [form, setForm] = useState({ email:"", password:"" });
//   const [error, setError] = useState("");
//   const { login } = useAuth(); const navigate = useNavigate();
//   async function submit(e) { e.preventDefault(); setError(""); try { const r = await api.post("/auth/login", form); login(r.data); navigate("/"); } catch(e) { setError(e.response?.data?.message || "Login failed"); } }
//   return <main className="auth"><form className="card" onSubmit={submit}><h1>Welcome back</h1><p>Sign in to ConnectHub</p>{error && <div className="error">{error}</div>}<input placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Password" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="primary">Login</button><p>New here? <Link to="/register">Create account</Link></p></form></main>;
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        form
      );

      login(response.data);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">

      <div className="auth-container">

        {/* LEFT BRAND PANEL */}

        <section className="auth-brand">

          <div className="auth-brand-badge">
            ✦ Your community, your space
          </div>

          <h2>
            Connect.
            <br />
            Share.
            <br />
            Grow.
          </h2>

          <p>
            ConnectHub is a modern social platform
            where you can share ideas, discover
            communities, and stay connected.
          </p>

        </section>

        {/* LOGIN FORM */}

        <section className="auth-form">

          <h1>
            Welcome back 👋
          </h1>

          <p className="auth-form-subtitle">
            Sign in to continue to ConnectHub.
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              required
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              required
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
            />

            <button
              className="primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">
              Create one
            </Link>
          </div>

        </section>

      </div>

    </main>
  );
}