import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "होम / Home" },
    { to: "/about", label: "About" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/login", label: "Login" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-leaf-700 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span
            className="text-white font-display font-bold text-xl tracking-wide"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            AgriSarthi <span className="text-leaf-200">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`font-medium text-sm transition-colors duration-200 px-2 py-1 rounded ${
                  isActive(to)
                    ? "bg-white text-leaf-700 font-semibold"
                    : "text-leaf-100 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/dashboard"
              className="bg-soil-400 hover:bg-soil-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Ask Sarthi 🤖
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-leaf-800 px-4 pb-4">
          <ul className="flex flex-col gap-2 pt-2">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded text-sm font-medium ${
                    isActive(to)
                      ? "bg-white text-leaf-700 font-semibold"
                      : "text-leaf-100 hover:bg-leaf-700"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block bg-soil-400 hover:bg-soil-500 text-white text-sm font-semibold px-3 py-2 rounded-lg text-center mt-1"
              >
                Ask Sarthi 🤖
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
