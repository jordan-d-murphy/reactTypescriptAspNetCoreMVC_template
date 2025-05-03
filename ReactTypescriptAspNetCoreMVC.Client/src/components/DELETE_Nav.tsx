// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/useAuth";

// export function Nav() {
//   const { isAuthenticated, logout, user, roles } = useAuth();
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     logout();
//     setTimeout(() => {
//       navigate("/", { replace: true });
//     }, 0);
//   };

//   return (
//     <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
//       <Link to="/" style={{ marginRight: "1rem" }}>
//         Home
//       </Link>

//       {isAuthenticated ? (
//         <>
//           <Link to="/uuid" style={{ marginRight: "1rem" }}>
//             UUID
//           </Link>
//           <Link to="/timestamp" style={{ marginRight: "1rem" }}>
//             Timestamp
//           </Link>
//           <Link to="/random" style={{ marginRight: "1rem" }}>
//             Random Number
//           </Link>
//           <Link to="/projects" style={{ marginRight: "1rem" }}>
//             Projects
//           </Link>
//           <Link to="/profile" style={{ marginRight: "1rem" }}>
//             Profile
//           </Link>
//           <Link to="/notifications" style={{ marginRight: "1rem" }}>
//             Notifications
//           </Link>
//           <Link to="/dashboard" style={{ marginRight: "1rem" }}>
//             Dashboard
//           </Link>

//           {isAuthenticated && roles.includes("Admin") && (
//             <Link to="/admin" style={{ marginRight: "1rem" }}>
//               Admin
//             </Link>
//           )}

//           <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
//             Logout ({user?.displayName || user?.username || "User"})
//           </button>
//         </>
//       ) : (
//         <>
//           <Link to="/login" style={{ marginRight: "1rem" }}>
//             Login
//           </Link>
//           <Link to="/register" style={{ marginRight: "1rem" }}>
//             Register
//           </Link>
//         </>
//       )}
//     </nav>
//   );
// }
