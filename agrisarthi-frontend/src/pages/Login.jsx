import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { userAPI } from "../utils/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle OAuth Redirect Callbacks and existing session checking
  useEffect(() => {
    // 1. Check if token and session details are passed as query parameters (OAuth callback redirect)
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const userIdParam = params.get('userId');
    const userNameParam = params.get('userName');

    if (tokenParam && userIdParam) {
      localStorage.setItem('authToken', tokenParam);
      localStorage.setItem('userId', userIdParam);
      if (userNameParam) {
        localStorage.setItem('userName', decodeURIComponent(userNameParam));
      }
      navigate('/dashboard', { replace: true });
      return;
    }

    // 2. Check if already logged in
    const existingToken = localStorage.getItem('authToken');
    if (existingToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.email || !form.password) {
      setError("Email and Password are required / ईमेल और पासवर्ड आवश्यक हैं");
      return;
    }
    if (mode === "register" && !form.name) {
      setError("Name is required for registration / पंजीकरण के लिए नाम आवश्यक है");
      return;
    }

    try {
      setLoading(true);

      if (mode === "register") {
        // Register
        const response = await userAPI.register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined
        });
        if (response.success) {
          setError(null);
          // Switch to login mode after successful registration
          setMode("login");
          setForm({ name: "", email: "", password: "", phone: "" });
          setError("Registration successful! Please login / पंजीकरण सफल! कृपया लॉगिन करें।");
        }
      } else {
        // Login
        const response = await userAPI.login({
          email: form.email,
          password: form.password,
        });
        if (response.success) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('userName', response.data.name);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
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
                  Email Address / ईमेल
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. ramesh@gmail.com"
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                />
              </div>
              {mode === "register" && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                    Phone Number (Optional) / मोबाइल
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-leaf-400 transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                  Password / पासवर्ड
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

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-xs font-medium uppercase">Or Login With</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.072 0-5.561-2.49-5.561-5.561s2.49-5.561 5.561-5.561c1.378 0 2.63.502 3.593 1.327l3.1-3.1C18.665 1.932 15.65 1 12.24 1 5.767 1 .5 6.267.5 12.74S5.767 24.48 12.24 24.48c6.48 0 11.54-4.596 11.54-11.74 0-.749-.07-1.478-.2-2.185H12.24z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-900 dark:text-gray-100" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </button>
              </div>

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
