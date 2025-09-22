import React from "react";
import { Key, Shield, Zap, RefreshCw, Monitor } from "lucide-react";

const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 ">
      <div className="flex flex-col md:flex-row w-full max-w-5xl  bg-white shadow-md hover:shadow-lg transition-shadow duration 200 rounded-xl overflow-hidden ">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex flex-col justify-center p-10 relative">
          <div className="absolute top-6 left-6 flex items-center space-x-2 text-xl font-bold">
            <Key />
            <span>Fortress Key</span>
          </div>
          <h2 className="text-3xl font-semibold mb-4 mt-6">Secure Your Digital Life</h2>
          <p className="mb-6 text-lg opacity-90">
            Join thousands who trust Fortress Key with their sensitive information.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Military-grade encryption</span>
            </li>
            <li className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Instant password generation</span>
            </li>
            <li className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Cross-device synchronization</span>
            </li>
            <li className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Advanced security monitoring</span>
            </li>
          </ul>
        </div>

        {/* Right Panel (Dynamic Form goes here) */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center dark:bg-blue-950">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
