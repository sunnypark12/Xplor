
import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import Button from "../components/common/Button";

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('./src/homebg.png')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Top bar */}
      <div className="relative z-10 w-full px-10 py-10 flex justify-between items-center text-white">
        <h1 className="text-3xl font-bold play-regular">Xplor</h1>
        <Link
          to="/how-it-works"
          className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
        >
          <HelpCircle className="w-6 h-6 text-white" />
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-start justify-between px-20 pt-20 gap-16">
        {/* Left column: greeting + tagline */}
        <div className="flex flex-col justify-start items-start ml-4">
          <h2
            className="drop-shadow-lg text-white"
            style={{ fontFamily: "LTCushion, sans-serif", fontSize: "8vw" }}
          >
            Hello!
          </h2>
          <p className="text-xl play-regular text-white mt-2">
            Plan smart. Xplor free.
          </p>
        </div>

        {/* Right column: login card */}
        <div className="flex justify-start mt-8">
          <div
            className="glass-card relative bg-white/10 backdrop-blur-md rounded-xl p-8"
            style={{ width: "515px", minHeight: "585px" }}
          >
            <h3 className="text-3xl font-semibold text-center play-regular text-white mb-10">
              LOGIN
            </h3>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="glass-input play-regular w-full mb-6 px-6 py-5 placeholder-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="glass-input play-regular w-full mb-8 px-6 py-5 placeholder-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />

            {/* Divider */}
            <div className="flex items-center my-8">
              <hr className="flex-1 border-gray-500" />
              <span className="px-3 text-gray-400">or</span>
              <hr className="flex-1 border-gray-500" />
            </div>

            {/* Google button */}
            <Button className="w-full flex items-center justify-center play-regular bg-white text-gray-800 hover:bg-gray-100 py-4 text-lg">
              <img
                src="/images/google-icon.svg"
                alt="Google"
                className="w-6 h-6 mr-3"
              />
              Continue with Google
            </Button>

            {/* Sign up link */}
            <p className="text-center text-gray-300 play-regular text-white mt-8 text-lg">
              No account?{" "}
              <Link
                to="/register"
                className="text-white play-regular font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
