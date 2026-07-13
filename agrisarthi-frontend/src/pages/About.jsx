import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

const teamValues = [
  {
    icon: "🎯",
    title: "Farmer-First Design",
    desc: "Every feature is built around real problems faced by farmers in rural Uttarakhand — from network constraints to language preferences.",
    accentColor: "bg-leaf-100",
    iconColor: "text-leaf-700",
  },
  {
    icon: "🔒",
    title: "Trusted & Reliable",
    desc: "AgriSarthi uses Gemini AI with agricultural context to ensure responses are grounded, practical, and safe to act on.",
    accentColor: "bg-sky-50",
    iconColor: "text-sky-700",
  },
  {
    icon: "🌍",
    title: "Accessible Everywhere",
    desc: "Designed to work on low-end smartphones with simple UI, multilingual support, and minimal data usage.",
    accentColor: "bg-orange-50",
    iconColor: "text-orange-700",
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Page Header */}
        <section
          className="py-14 px-4 text-center"
          style={{ background: "linear-gradient(135deg, #14532d, #15803d)" }}
        >
          <span className="inline-block bg-white bg-opacity-20 text-leaf-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            About AgriSarthi AI
          </span>
          <h1
            className="text-white text-4xl md:text-5xl font-extrabold mb-3"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Kisan Ka Digital Saathi
          </h1>
          <p className="text-leaf-200 text-lg max-w-xl mx-auto">
            Bridging the gap between farmers and agricultural expertise using the power of AI.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-4xl mx-auto px-4 py-14">
          <h2
            className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            AgriSarthi AI was built to solve a real, pressing problem: farmers in remote
            regions of Uttarakhand often have no quick access to agricultural experts when
            their crops are under threat. A pest outbreak, a mysterious yellowing of leaves,
            or confusion about fertilizer timing — these issues can cost an entire season's
            harvest if advice doesn't arrive in time.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Our AI chatbot, powered by Google's Gemini API, acts as an always-available
            digital advisor — responding in Hindi or English, understanding local crop
            contexts, and giving actionable guidance instantly.
          </p>
        </section>

        {/* Values */}
        <section className="bg-leaf-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-extrabold text-gray-800 mb-6 text-center"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {teamValues.map((v) => (
                <Card key={v.title} {...v} />
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="max-w-4xl mx-auto px-4 py-14">
          <h2
            className="text-2xl font-extrabold text-gray-800 mb-6"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Frontend", value: "React.js + Tailwind CSS" },
              { label: "Backend", value: "Node.js + Express.js" },
              { label: "Database", value: "MongoDB" },
              { label: "AI Engine", value: "Google Gemini API" },
              { label: "Auth", value: "JWT Authentication" },
              { label: "Deployment", value: "Vercel + Render" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-leaf-600 font-semibold uppercase tracking-wide mb-1">{label}</p>
                <p className="text-gray-800 font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
