import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ token: null, name: "" });
  const location = useLocation();

  useEffect(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'true' || (!savedMode && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check for user login status
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    if (token) {
      setUser({ token, name: name || 'User' });
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUser({ token: null, name: "" });
    window.location.href = '/';
  };

  const baseLinks = [
    { to: "/", label: "होम / Home" },
    { to: "/about", label: "About" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  const links = user.token 
    ? baseLinks 
    : [...baseLinks, { to: "/login", label: "Login" }];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-leaf-700 dark:bg-gray-900 shadow-md sticky top-0 z-50">
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
          {user.token && (
            <li className="flex items-center gap-3">
              <span className="text-white text-xs font-semibold bg-leaf-800 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-leaf-600 dark:border-gray-700">
                👤 {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-100 hover:text-red-300 font-medium text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-leaf-800 dark:hover:bg-gray-800 border border-transparent hover:border-red-400"
              >
                Logout
              </button>
            </li>
          )}
          <li>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </li>
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
        <div className="md:hidden bg-leaf-800 dark:bg-gray-800 px-4 pb-4">
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
            {user.token && (
              <li className="border-t border-leaf-600 dark:border-gray-700 pt-2 flex flex-col gap-1.5">
                <span className="text-leaf-200 text-xs px-3 py-1 font-semibold">
                  👤 {user.name}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left text-red-200 hover:text-red-400 text-sm px-3 py-2 rounded font-medium hover:bg-leaf-700"
                >
                  Logout / लॉगआउट
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {darkMode ? (
                  <>
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                  </>
                )}
              </button>
            </li>
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
