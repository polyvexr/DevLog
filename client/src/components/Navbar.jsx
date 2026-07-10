import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { FiZap, FiSettings } from "react-icons/fi";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-b border-blue-500/20 shadow-lg shadow-blue-500/10">
      <div className="app-container flex items-center justify-between p-4">
        <NavLink
          to="/"
          className="text-2xl font-black neon-text flex items-center gap-2"
        >
          <FiZap className="text-blue-400" /> DevLog
        </NavLink>

        <div className="flex gap-4 items-center">

          <NavLink
            to="/link"
            className={({ isActive }) =>
              `font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            + Link Platform
          </NavLink>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
