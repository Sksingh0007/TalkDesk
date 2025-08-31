import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Logo/Brand */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-r-purple-500 animate-spin animation-delay-150"></div>
          <div
            className="absolute inset-2 w-20 h-20 rounded-full border-2 border-blue-400/20 border-b-blue-400 animate-spin"
            style={{ animationDirection: "reverse" }}
          ></div>
        </div>

        {/* Animated Text */}
        <div className="text-center">
          <h1 className="text-6xl font-black tracking-wider mb-2 drop-shadow-2xl">
            {"TALKDESK".split("").map((letter, index) => (
              <span
                key={index}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: "1.2s",
                  fontWeight: "900",
                  color: "#ffffff",
                  textShadow:
                    "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="text-gray-300 text-sm font-medium tracking-wide">
            Connecting conversations...
          </p>

          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-72 h-2 bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-pulse shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
