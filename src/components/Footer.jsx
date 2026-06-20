import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-leaf-900 dark:bg-gray-900 text-leaf-200 dark:text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌾</span>
              <span
                className="text-white dark:text-gray-100 text-xl font-extrabold"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                AgriSarthi AI
              </span>
            </div>
            <p className="text-sm text-leaf-300 dark:text-gray-400 leading-relaxed">
              Kisan ka digital saathi — empowering Uttarakhand's farming communities
              with instant AI-powered crop guidance.
            </p>
            <p className="text-xs text-leaf-400 dark:text-gray-500 mt-3">
              Built as part of TBI Summer Internship 2025
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white dark:text-gray-100 font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/dashboard", label: "Chat Dashboard" },
                { to: "/login", label: "Login / Register" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white dark:hover:text-gray-100 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4
              className="text-white dark:text-gray-100 font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Features
            </h4>
            <ul className="space-y-2 text-sm text-leaf-300 dark:text-gray-400">
              <li>🌿 AI Crop Advisory</li>
              <li>🪲 Disease & Pest ID</li>
              <li>💧 Fertilizer & Irrigation</li>
              <li>🗣️ Hindi + English Support</li>
              <li>📜 Chat History</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-leaf-800 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-leaf-400 dark:text-gray-500">
          <p>© 2025 AgriSarthi AI. Made with ❤️ for farmers of Uttarakhand.</p>
          <p>Powered by Gemini AI · React · Node.js · MongoDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
