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
    <nav className="w-full bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="app-container flex items-center justify-between p-4">
        <NavLink
          to="/"
          className="text-2xl font-black text-slate-900 flex items-center gap-2"
        >
          <FiZap className="text-[#e23e2d]" /> DevLog
        </NavLink>

        <div className="flex gap-4 items-center">

          <NavLink
            to="/link"
            className={({ isActive }) =>
              `font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#e23e2d] text-white shadow-lg shadow-red-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            + Link Platform
          </NavLink>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="bg-[#e23e2d] hover:bg-[#cf2e2e] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
