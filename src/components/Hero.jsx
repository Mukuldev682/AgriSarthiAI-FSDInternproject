import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-leaf-900 via-leaf-800 to-leaf-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"
      style={{ minHeight: "88vh" }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: "#bbf7d0", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: "#d97706", transform: "translate(-30%, 40%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
        {/* Text Column */}
        <div className="flex-1 text-center md:text-left">
          {/* Eyebrow */}
          <span className="inline-block bg-leaf-600 text-leaf-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Uttarakhand के किसानों के लिए
          </span>

          <h1
            className="text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            अपनी फसल का
            <br />
            <span className="text-soil-200" style={{ color: "#fde68a" }}>
              डिजिटल साथी
            </span>
          </h1>

          <p className="text-leaf-100 text-lg md:text-xl mb-3 max-w-lg mx-auto md:mx-0 leading-relaxed">
            AgriSarthi AI gives you instant expert advice on crop diseases, pests,
            fertilizers, and irrigation — in Hindi and English.
          </p>
          <p className="text-leaf-200 text-sm mb-8 max-w-lg mx-auto md:mx-0">
            No internet expert needed. Just ask.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/dashboard"
              className="bg-soil-400 hover:bg-soil-500 text-white font-bold px-8 py-3 rounded-xl text-lg shadow-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: "#d97706" }}
            >
              🤖 Sarthi से पूछो (Ask Now)
            </Link>
            <Link
              to="/about"
              className="border-2 border-leaf-200 text-leaf-100 hover:bg-leaf-600 font-semibold px-8 py-3 rounded-xl text-lg transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            {[
              { icon: "🌾", text: "Crop Disease ID" },
              { icon: "🪲", text: "Pest Control" },
              { icon: "💧", text: "Irrigation Tips" },
              { icon: "🗣️", text: "Hindi + English" },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1 text-sm text-leaf-100 bg-white bg-opacity-10 px-3 py-1.5 rounded-full"
              >
                {icon} {text}
              </span>
            ))}
          </div>
        </div>

        {/* Illustration / Visual Column */}
        <div className="flex-1 flex justify-center items-center">
          <div
            className="relative bg-white bg-opacity-10 rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl max-w-sm w-full"
          >
            {/* Chat bubble mockup */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-soil-400 flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: "#d97706" }}>
                  👨‍🌾
                </div>
                <div className="bg-white bg-opacity-20 rounded-2xl rounded-tl-none px-4 py-3 text-white text-sm max-w-xs">
                  मेरे टमाटर की पत्तियां पीली पड़ रही हैं, क्या करूँ?
                </div>
              </div>
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-9 h-9 rounded-full bg-leaf-500 flex items-center justify-center text-lg flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white rounded-2xl rounded-tr-none px-4 py-3 text-leaf-800 text-sm max-w-xs shadow">
                  <p className="font-semibold text-leaf-700 mb-1">AgriSarthi AI</p>
                  यह Nitrogen की कमी या Early Blight हो सकती है। पत्तियों के नीचे भूरे धब्बे देखें...
                  <span className="text-leaf-500 text-xs block mt-1">Typing…</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border border-white border-opacity-20 rounded-xl px-3 py-2 bg-white bg-opacity-10">
                <input
                  type="text"
                  placeholder="अपना सवाल यहाँ लिखें..."
                  className="flex-1 bg-transparent text-white placeholder-leaf-300 text-sm outline-none"
                  readOnly
                />
                <button className="text-soil-200 font-bold text-lg" style={{ color: "#fde68a" }}>➤</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hidden">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden dark:block">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#1f2937" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
