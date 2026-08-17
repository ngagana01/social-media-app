// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   return <nav><Link className="brand" to="/">ConnectHub</Link><div className="navlinks"><Link to="/">Feed</Link><Link to="/profile">{user?.name}</Link><button onClick={() => { logout(); navigate("/login"); }}>Logout</button></div></nav>;
// }
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || "User";
  const firstLetter = userName.charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/" className="brand">
        <span className="brand-dot"></span>
        ConnectHub
      </Link>

      <div className="navlinks">
        <Link to="/">Home</Link>

        <Link to="/profile" className="nav-profile">
          <span className="nav-avatar">{firstLetter}</span>
          <span>{userName}</span>
        </Link>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}