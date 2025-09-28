import React from "react";
import { Link } from "react-router-dom";
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
        <h1 className="text-3xl font-bold play-regular" style={{ fontSize: "1.5rem", marginLeft: "20px", marginTop: "10px" }}>Xplor</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/how-it-works"
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition flex items-center justify-center"
            title="How it works"
            style={{ marginRight: "10px" }}
          >
            <img 
              src="./src/question.png" 
              alt="How it works" 
              className="w-6 h-6"
            />
          </Link>
          <Link
            to="/profile"
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition flex items-center justify-center"
            title="Profile"
            style={{ marginRight: "20px" }}
          >
            <img 
              src="./src/profile.png" 
              alt="Profile" 
              className="w-6 h-6"
            />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center px-20 gap-16">
        {/* Left column: greeting + tagline */}
        <div className="flex flex-col justify-center items-center" style={{ width: "40%" }}>
          <h2
            className="drop-shadow-lg"
            style={{ 
              fontFamily: "LTCushion, sans-serif", 
              fontSize: "9vw",
              color: "#f1f1f1",
              lineHeight: "0.8",
              marginTop: "120px",
              marginLeft: "-70px",
            }}
          >
          Hello!
          </h2>
          <p 
            className="font-light play-regular"
            style={{ 
              fontSize: "1.8rem",
              color: "#f1f1f1", 
              marginLeft: "-90px",
              paddingLeft: "0"
            }}
          >
          Plan smart. Xplor free.
          </p>
        </div>

        {/* Right column: login card */}
        <div 
          className="flex justify-center items-center flex-1"
        >
          <div 
            className="glass-card" 
            style={{ 
              minHeight: "600px",
              marginLeft: "180px",
              marginTop: "40px"
            }}
          >
            <div
              className="relative p-10"
              style={{ width: "550px" }}
            >
            <h3 className="play-regular text-center mb-12 tracking-wider"
              style={{ 
                fontSize: "2.5rem",
                color: "#f1f1f1", 
                marginTop: "70px"
              }}>
              LOGIN
            </h3>

            {/* Input fields container */}
            <div className="flex flex-col items-center gap-40">
              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="glass-card play-regular text-white placeholder-white/70 focus:outline-none transition-all"
                style={{ 
                  width: "50%", 
                  height: "10%", 
                  fontSize: "1rem", 
                  padding: "0.75rem",
                  marginTop: "15px",
                }}
              />
          
              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                className="glass-card play-regular text-white placeholder-white/70 focus:outline-none transition-all"
                style={{ 
                  width: "50%", 
                  marginTop: "20px",
                  height: "10%", 
                  fontSize: "1rem", 
                  padding: "0.75rem"
                }}
              />
            </div>

            {/* Login Button */}
            <div className="flex justify-center mt-6">
              <Link
                to="/test-home"
                className="glass-card play-regular hover:bg-white/20 transition-all px-8 py-3 rounded-lg flex items-center justify-center"
                style={{ 
                  fontSize: ".9rem",
                  marginTop: '20px',
                  color: "black",
                  width: "18%", 
                  height: "5%", 
                  textDecoration: "none",
                  display: "flex"
                }}
              >
                Submit
              </Link>
            </div>
          


            {/* Google button */}
            <Button className="w-full flex items-center justify-center bg-transparent text-white hover:bg-white/10 py-4 text-lg font-medium rounded-lg transition-all">
              <div className="w-4 h-4 mr-3 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            </Button>

            {/* Sign up link */}
            <div className="flex flex-col items-center mt-8 play-regular">
              <p className="text-center"
              style={{
                fontSize: "1rem",
                color: "#f1f1f1",
                marginTop: "15px",
              }}>
                No account?
              </p>
                <Link
                  to="/signup"
                className="hover:underline underline-offset-2"
                style={{
                  fontSize: "1rem",
                  color: "#f1f1f1",
                }}
              >
                Sign up
              </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
