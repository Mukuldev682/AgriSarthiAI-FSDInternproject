import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { userAPI } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (mode === "register") {
        // Register
        const response = await userAPI.register(form);
        if (response.success) {
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('userName', response.data.name);
          setError(null);
          // Switch to login mode after successful registration
          setMode("login");
          setForm({ name: "", phone: "", password: "" });
          setError("Registration successful! Please login.");
        }
      } else {
        // Login
        const response = await userAPI.login({
          phone: form.phone,
          password: form.password,
        });
        if (response.success) {
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('userName', response.data.name);
          localStorage.setItem('authToken', 'demo-token-' + response.data.id);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div
              className="py-8 px-6 text-center bg-gradient-to-br from-leaf-900 to-leaf-600 dark:from-gray-800 dark:to-gray-700"
            >
              <span className="text-4xl">🌾</span>
              <h1
                className="text-white dark:text-gray-100 text-2xl font-extrabold mt-2"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                AgriSarthi AI
              </h1>
              <p className="text-leaf-200 dark:text-gray-300 text-sm mt-1">Kisan ka digital saathi</p>
            </div>

            {/* Toggle */}
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    mode === m
                      ? "text-leaf-700 dark:text-leaf-400 border-b-2 border-leaf-600 dark:border-leaf-400"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
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
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                    Full Name / नाम
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                  Phone Number / मोबाइल
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3 rounded-xl text-sm transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#16a34a" }}
              >
                {loading ? <Loader size="small" /> : (mode === "login" ? "Login →" : "Create Account →")}
              </button>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-leaf-600 dark:text-leaf-400 font-semibold hover:underline"
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
                      className="text-leaf-600 dark:text-leaf-400 font-semibold hover:underline"
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            🔒 JWT secured · Your data stays private
          </p>
        </div>
      </main>
      <Footer />
      {error && <Toast message={error} type={error.includes("successful") ? "success" : "error"} onClose={() => setError(null)} />}
    </div>
  );
};

export default Login;
