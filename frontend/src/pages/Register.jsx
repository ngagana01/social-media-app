// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// export default function Register() {
//   const [form, setForm] = useState({ name:"", email:"", password:"" });
//   const [error, setError] = useState("");
//   const { login } = useAuth(); const navigate = useNavigate();
//   async function submit(e) { e.preventDefault(); setError(""); try { const r = await api.post("/auth/register", form); login(r.data); navigate("/"); } catch(e) { setError(e.response?.data?.message || "Registration failed"); } }
//   return <main className="auth"><form className="card" onSubmit={submit}><h1>Join ConnectHub</h1><p>Create your account</p>{error && <div className="error">{error}</div>}<input placeholder="Full name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Password (6+ characters)" type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="primary">Register</button><p>Already have an account? <Link to="/login">Login</Link></p></form></main>;
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      login(response.data);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">

      <div className="auth-container">

        {/* BRAND SECTION */}

        <section className="auth-brand">

          <div className="auth-brand-badge">
            ✦ Join the community
          </div>

          <h2>
            Your story
            <br />
            starts here.
          </h2>

          <p>
            Create your ConnectHub account and
            start sharing your ideas, projects,
            experiences, and moments.
          </p>

        </section>

        {/* REGISTER FORM */}

        <section className="auth-form">

          <h1>
            Create account
          </h1>

          <p className="auth-form-subtitle">
            Join ConnectHub in less than a minute.
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label>
              Full Name
            </label>

            <input
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              required
              minLength={2}
              onChange={handleChange}
            />

            <label>
              Email Address
            </label>

            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              required
              onChange={handleChange}
            />

            <label>
              Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              required
              minLength={6}
              onChange={handleChange}
            />

            <label>
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              required
              onChange={handleChange}
            />

            <button
              className="primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </div>

        </section>

      </div>

    </main>
  );
}