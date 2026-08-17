// // import { Navigate, Outlet } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // export default function ProtectedRoute() {
// //   const { user, loading } = useAuth();
// //   if (loading) return <div className="center">Loading...</div>;
// //   return user ? <Outlet /> : <Navigate to="/login" replace />;
// // }
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute() {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   // Wait until authentication is checked
//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="loading-spinner"></div>
//         <p>Loading ConnectHub...</p>
//       </div>
//     );
//   }

//   // User is not logged in
//   if (!user) {
//     return (
//       <Navigate
//         to="/login"
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   // User is authenticated
//   return <Outlet />;
// }

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading ConnectHub...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}