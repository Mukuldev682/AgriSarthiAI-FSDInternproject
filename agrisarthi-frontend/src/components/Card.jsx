import React from "react";

/**
 * Card component — reusable feature/info card
 * Props:
 *   icon     {string}  Emoji or text icon
 *   title    {string}  Card heading
 *   desc     {string}  Card body text
 *   badge    {string}  Optional top-right badge text
 *   accentColor {string} Optional Tailwind bg color class for icon bg (default green)
 *   onClick  {func}   Optional click handler
 */
const Card = ({
  icon = "🌿",
  title = "Feature",
  desc = "Description goes here.",
  badge,
  accentColor = "bg-leaf-100",
  iconColor = "text-leaf-700",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col gap-3 group ${
        onClick ? "cursor-pointer hover:-translate-y-1" : ""
      }`}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-4 right-4 bg-leaf-100 dark:bg-leaf-900 text-leaf-700 dark:text-leaf-300 text-xs font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${accentColor} dark:bg-gray-700 ${iconColor} dark:text-leaf-300 flex items-center justify-center text-2xl`}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3
          className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 group-hover:text-leaf-700 dark:group-hover:text-leaf-400 transition-colors"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* Arrow indicator if clickable */}
      {onClick && (
        <span className="text-leaf-500 dark:text-leaf-400 text-sm font-semibold mt-auto self-start group-hover:underline">
          जानें →
        </span>
      )}
    </div>
  );
};

export default Card;
