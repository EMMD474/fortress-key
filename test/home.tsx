import { Lock, Sun, Moon } from "lucide-react";
import React, { useState } from "react";

// Mock components for demo
const NavBar = ({ darkMode, toggleDarkMode }) => (
  <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
    darkMode 
      ? 'bg-gray-900/90 border-gray-700' 
      : 'bg-white/90 border-gray-200'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Lock className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Fortress Key
          </span>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </nav>
);

const SlideShow = ({ darkMode }) => (
  <div className="relative w-full max-w-4xl mx-auto h-80 overflow-hidden rounded-2xl shadow-2xl">
    <div className={`absolute inset-0 bg-gradient-to-br ${
      darkMode 
        ? 'from-blue-900 via-blue-800 to-indigo-900' 
        : 'from-blue-500 via-blue-600 to-indigo-600'
    }`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white p-8">
          <Lock className="w-24 h-24 mx-auto mb-6 opacity-80" />
          <h3 className="text-3xl font-bold mb-4">Your Digital Vault</h3>
          <p className="text-lg opacity-90">Protecting what matters most to you</p>
        </div>
      </div>
    </div>
  </div>
);

const Card = ({ icon, heading, description, darkMode }) => (
  <div className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
    darkMode 
      ? 'bg-gray-800 border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/25' 
      : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/25'
  }`}>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' 
        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
    }`}>
      {icon}
    </div>
    
    <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      {heading}
    </h3>
    
    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
      darkMode ? 'text-gray-300' : 'text-gray-600'
    }`}>
      {description}
    </p>
  </div>
);

const Footer = ({ darkMode }) => (
  <footer className={`w-full border-t transition-colors duration-300 ${
    darkMode 
      ? 'bg-gray-900 border-gray-700' 
      : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Lock className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Fortress Key
          </span>
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          © 2025 Fortress Key. All rights reserved. Your security is our priority.
        </p>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const whyCards = [
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Military-Grade Encryption",
      description:
        "Your data is protected with AES-256 encryption, the same standard used by governments and security experts worldwide.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Instant Password Generation",
      description:
        "Create strong, unique passwords for every account with our built-in password generator.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Cross-Device Sync",
      description:
        "Access your passwords from anywhere - your phone, tablet, or computer - with seamless synchronization.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Multi-Factor Authentication",
      description:
        "Protect your passwords with a second layer of security with multi-factor authentication.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Biometric Authentication",
      description:
        "Unlock your vault with Face ID, Touch ID, or other biometric methods for maximum convenience.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Zero-Knowledge Architecture",
      description:
        "We never have access to your master password or encrypted data. Your privacy is guaranteed.",
    },
  ];

  const howItWorks = [
    {
      heading: "Create an Account",
      description:
        "Sign up with your email and create a strong master password",
    },
    {
      heading: "Add Your Passwords",
      description: "Import existing passwords or add them as you browse",
    },
    {
      heading: "Enjoy Security",
      description: "Autofill passwords across all your devices securely",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="pt-16 sm:pt-20 flex flex-col items-center w-full">
        {/* Hero Section */}
        <div className="w-full max-w-7xl px-4 sm:px-8 lg:px-14 text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full"></div>
              <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h1 className={`mt-6 sm:mt-10 text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-blue-800'
              }`}>
                Secure your digital life with{" "}
                <span className={`bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent animate-pulse`}>
                  Fortress Key
                </span>
              </h1>
              
              <p className={`mt-6 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-3xl mx-auto transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                The world's most trusted password manager. Store, generate, and
                autofill passwords with military-grade encryption.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started Free
                </button>
                <button className={`px-8 py-4 font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}>
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Show */}
        <div className="w-full max-w-7xl px-4 sm:px-8 lg:px-14 mt-16">
          <SlideShow darkMode={darkMode} />
        </div>

        {/* Why Choose Us Section */}
        <div className="w-full max-w-7xl px-4 sm:px-8 lg:px-14 mt-20 text-center mb-10">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-blue-800'
          }`}>
            Why Choose Fortress Key
          </h2>
          <p className={`mt-6 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Fortress Key is the most secure password manager on the market. Our
            advanced encryption ensures that your data is protected from
            unauthorized access.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12 w-full">
            {whyCards.map((card, index) => (
              <Card
                key={index}
                icon={card.icon}
                heading={card.heading}
                description={card.description}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* How Fortress Key Works */}
          <div className="mt-20 w-full text-center">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-blue-800'
            }`}>
              How Fortress Key Works
            </h2>
            <p className={`mt-6 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Getting started with Fortress Key is simple. Create an account, add
              your passwords, and enjoy secure access to your digital life.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Connecting line */}
                  {index < howItWorks.length - 1 && (
                    <div className={`hidden md:block absolute top-6 left-full w-full h-0.5 z-0 transition-colors duration-300 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}>
                      <div className="absolute top-1/2 right-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                  )}

                  {/* Step Circle */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl mx-auto z-10 relative shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <h3 className={`mt-6 text-xl font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.heading}
                  </h3>
                  <p className={`mt-3 text-base leading-relaxed max-w-xs mx-auto transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default HomePage;