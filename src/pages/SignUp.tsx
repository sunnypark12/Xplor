import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import signupBg from "../Signup.png";
import toast from "react-hot-toast";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      await signUp(formData.email, formData.password, displayName);
      
      // Navigate to quiz page after successful signup
      navigate("/quiz");
    } catch (error: any) {
      console.error('Signup error:', error);
      // Error toast is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Override body background when component mounts
    const originalBackground = document.body.style.backgroundImage;
    const originalBackgroundColor = document.body.style.backgroundColor;
    
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = 'transparent';
    
    // Cleanup: restore original background when component unmounts
    return () => {
      document.body.style.backgroundImage = originalBackground;
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, []);

  return (
    <div 
      className="signup-page relative min-h-screen flex flex-col" 
      style={{ 
        backgroundColor: '#1a1a1a',
        backgroundImage: `url(${signupBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        height: '100%'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

        {/* Top bar */}
    <div className="relative z-10 w-full px-10 py-10 flex justify-between items-center text-white">
        <h1 className="text-3xl font-bold play-regular" style={{ fontSize: "1.5rem", marginLeft: "20px", marginTop: "10px" }}>Xplor</h1>
        <Link
          to="/how-it-works"
          className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
        >
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-start justify-between px-6 py-12" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="w-full max-w-md" style={{ marginLeft: "130px", marginTop: "120px" }}>
          {/* Brand and heading */}
          <div className="text-start mb-8">
            <h1 className="text-white play-regular mb-4" style={{ fontSize: "3rem", color: "#f1f1f1" }}>Create a new account.</h1>
            <p className="play-regular" style={{ fontSize: "1rem", color: "#f1f1f1" }}>
              Already a member?
              <Link 
                to="/" 
                className="text-orange-300 play-regular"  style={{ fontSize: "1rem", color: "#f1f1f1", marginLeft: "7px" }}
              >
            Log in
              </Link>
            </p>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-8" style={{ marginTop: "20px" }}>
            {/* First Name and Last Name row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-white text-sm font-medium mb-2 play-regular">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="glass-card play-regular text-white placeholder-white/70 focus:outline-none transition-all"
                  style={{ 
                    width: "100%", 
                    height: "50px", 
                    fontSize: "0.8rem", 
                    padding: "0.5rem"
                  }}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-white text-sm font-medium mb-2 play-regular" style={{ marginLeft: "10px" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="glass-card play-regular text-white placeholder-white/70 focus:outline-none transition-all"
                  style={{ 
                    width: "95%", 
                    height: "50px", 
                    fontSize: "0.8rem", 
                    padding: "0.5rem",
                    marginLeft: "10px",
                  }}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2 play-regular">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="glass-card play-regular text-white placeholder-white/70 focus:outline-none transition-all"
                style={{ 
                  width: "100%", 
                  height: "50px", 
                  fontSize: "1rem", 
                  padding: "0.75rem",
                }}
                placeholder="Email"
                required
              />
            </div>

            {/* Password field */}
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2 play-regular">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="glass-card play-regular text-white placeholder-white/70 focus:outline-none transition-all"
                style={{ 
                  width: "100%", 
                  height: "50px", 
                  fontSize: "1rem", 
                  padding: "0.75rem"
                }}
                placeholder="Password"
                required
              />
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={isLoading}
              className="glass-card play-regular text-white focus:outline-none transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                height: "50px", 
                fontSize: "1rem", 
                padding: "0.75rem",
                marginTop: "40px",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
