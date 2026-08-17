// // import { Routes, Route, Navigate } from "react-router-dom";
// // import { AuthProvider } from "./context/AuthContext";
// // import ProtectedRoute from "./components/ProtectedRoute";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Home from "./pages/Home";
// // import Profile from "./pages/Profile";

// // export default function App(){
// //  return <AuthProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route element={<ProtectedRoute/>}><Route path="/" element={<Home/>}/><Route path="/profile" element={<Profile/>}/></Route><Route path="*" element={<Navigate to="/"/>}/></Routes></AuthProvider>;
// // }

// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Explore from "./pages/Explore";
// import Notifications from "./pages/Notifications";
// import PostDetails from "./pages/PostDetails";

// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* PUBLIC */}

//         <Route
//           path="/login"
//           element={<Login />}
//         />

//         <Route
//           path="/register"
//           element={<Register />}
//         />

//         {/* PROTECTED */}

//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/explore"
//           element={
//             <ProtectedRoute>
//               <Explore />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/notifications"
//           element={
//             <ProtectedRoute>
//               <Notifications />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           }
//         />

//       </Routes>
//       <Route
//   path="/post/:id"
//   element={
//     <ProtectedRoute>
//       <PostDetails />
//     </ProtectedRoute>
//   }
// />

//     </BrowserRouter>
//   );
// }

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import PostDetails from "./pages/PostDetails";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}