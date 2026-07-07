import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { cropAPI } from "../utils/api";

const features = [
  {
    icon: "🤖",
    title: "AI Chat Assistant",
    desc: "Ask any farming question in Hindi or English and get instant AI-powered recommendations tailored to your crop and region.",
    badge: "Core Feature",
    accentColor: "bg-leaf-100",
    iconColor: "text-leaf-700",
  },
  {
    icon: "🌿",
    title: "Disease Detection Guide",
    desc: "Identify common crop diseases from your description. Sarthi walks you through symptoms, causes, and the right treatment.",
    accentColor: "bg-green-50",
    iconColor: "text-green-700",
  },
  {
    icon: "🪲",
    title: "Pest Management",
    desc: "Get advice on identifying pests attacking your crop and the safest, most effective ways to control them.",
    accentColor: "bg-yellow-50",
    iconColor: "text-yellow-700",
  },
  {
    icon: "💧",
    title: "Fertilizer & Irrigation",
    desc: "Receive crop-specific fertilizer schedules and irrigation guidance based on your soil and growth stage.",
    accentColor: "bg-sky-50",
    iconColor: "text-sky-700",
  },
  {
    icon: "🗣️",
    title: "Hindi + English",
    desc: "Talk to Sarthi in whichever language feels natural. Full support for both Hindi and English in the same conversation.",
    accentColor: "bg-purple-50",
    iconColor: "text-purple-700",
  },
  {
    icon: "📜",
    title: "Chat History",
    desc: "Your past conversations are saved so you can revisit previous advice, track your crops, and learn over time.",
    accentColor: "bg-orange-50",
    iconColor: "text-orange-700",
  },
];

const Home = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load crops from API
  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cropAPI.getAllCrops();
      if (response.success) {
        setCrops(response.data);
      }
    } catch (err) {
      setError(err.message);
      // Set default crops on error
      setCrops([
        { name: "Wheat · गेहूं", emoji: "🌾" },
        { name: "Rice · धान", emoji: "🌾" },
        { name: "Tomato · टमाटर", emoji: "🍅" },
        { name: "Potato · आलू", emoji: "🥔" },
        { name: "Mustard · सरसों", emoji: "🌼" },
        { name: "Maize · मक्का", emoji: "🌽" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <span className="text-leaf-600 dark:text-leaf-400 text-sm font-semibold uppercase tracking-widest">
              What AgriSarthi Does
            </span>
            <h2
              className="text-gray-800 dark:text-gray-100 text-3xl md:text-4xl font-extrabold mt-2"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              हर सवाल का जवाब, तुरंत
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
              From disease identification to irrigation planning — get reliable guidance
              without waiting for an expert.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* Crops Covered Section */}
        <section className="bg-leaf-50 dark:bg-gray-800 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2
                className="text-gray-800 dark:text-gray-100 text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                Crops We Support
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Advice tailored for common Uttarakhand crops
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {loading ? (
                <Loader size="medium" text="Loading crops..." />
              ) : (
                crops.map((crop) => (
                  <div
                    key={crop._id || crop.id || crop.name}
                    className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-leaf-100 dark:border-gray-600 rounded-xl px-5 py-3 shadow-sm text-gray-700 dark:text-gray-200 font-medium text-sm"
                  >
                    <span className="text-xl">{crop.emoji || '🌾'}</span> {crop.nameHindi ? `${crop.name} · ${crop.nameHindi}` : crop.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 text-center">
          <div
            className="max-w-2xl mx-auto rounded-3xl p-10 shadow-lg bg-gradient-to-br from-leaf-900 to-leaf-600 dark:from-gray-800 dark:to-gray-700"
          >
            <h2
              className="text-white dark:text-gray-100 text-3xl md:text-4xl font-extrabold mb-3"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              अभी Sarthi से बात करें
            </h2>
            <p className="text-leaf-200 dark:text-gray-300 mb-6">
              Free, instant, expert-level crop advice — right on your phone.
            </p>
            <Link
              to="/dashboard"
              className="inline-block font-bold px-10 py-3 rounded-xl text-leaf-800 text-lg transition-all hover:scale-105 bg-yellow-300 hover:bg-yellow-400"
            >
              🤖 Start Chatting
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
};

export default Home;
