import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", phone: "", password: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Backend not connected yet — this is the frontend skeleton!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header */}
            <div
              className="py-8 px-6 text-center"
              style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}
            >
              <span className="text-4xl">🌾</span>
              <h1
                className="text-white text-2xl font-extrabold mt-2"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                AgriSarthi AI
              </h1>
              <p className="text-leaf-200 text-sm mt-1">Kisan ka digital saathi</p>
            </div>

            {/* Toggle */}
            <div className="flex border-b border-gray-100">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    mode === m
                      ? "text-leaf-700 border-b-2 border-leaf-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {m === "login" ? "Login" : "Register"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    Full Name / नाम
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  Phone Number / मोबाइल
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-xl text-sm transition-colors hover:opacity-90"
                style={{ backgroundColor: "#16a34a" }}
              >
                {mode === "login" ? "Login →" : "Create Account →"}
              </button>

              <p className="text-center text-xs text-gray-400">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-leaf-600 font-semibold hover:underline"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-leaf-600 font-semibold hover:underline"
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 JWT secured · Your data stays private
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
