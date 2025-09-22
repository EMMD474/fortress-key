"use client";

import React, { useRef, useState, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

const OTPInput = ({
  length = 6,
  onComplete,
  hasError = false,
  disabled = false,
}: OTPInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { value } = e.target;

    // Only allow digits
    if (value && !/^[0-9]$/.test(value)) {
      e.target.value = "";
      return;
    }

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    // Move to next box if value entered
    if (value && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    if (onComplete && newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[idx]) {
        // Clear current field
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        // Move to previous field and clear it
        newOtp[idx - 1] = "";
        setOtp(newOtp);
        inputsRef.current[idx - 1]?.focus();
      }

      // Call onComplete with updated OTP
      if (onComplete) {
        onComplete(newOtp.join(""));
      }
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, length);

    if (digits.length > 0) {
      const newOtp = new Array(length).fill("");
      for (let i = 0; i < digits.length; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);

      // Focus the next empty field or the last field
      const nextEmptyIndex = Math.min(digits.length, length - 1);
      inputsRef.current[nextEmptyIndex]?.focus();

      // Call onComplete if all fields are filled
      if (onComplete && digits.length === length) {
        onComplete(digits); // ✅ return as string
      }
    }
  };

  // Clear all inputs when hasError changes to true
  useEffect(() => {
    if (hasError) {
      setOtp(new Array(length).fill(""));
      inputsRef.current[0]?.focus();
    }
  }, [hasError, length]);

  return (
    <div className="flex space-x-2 sm:space-x-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[i]}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={i === 0 ? handlePaste : undefined} // Only allow paste on first input
          disabled={disabled}
          className={`
            w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-mono
            border rounded-md transition-colors duration-200
            focus:outline-none focus:ring-2 focus:z-10
            ${
              hasError
                ? "border-red-300 dark:border-red-400 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400"
                : "border-gray-300 dark:border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
            }
            ${
              disabled
                ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50"
                : "bg-white dark:bg-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500"
            }
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          `}
          placeholder="0"
        />
      ))}
    </div>
  );
};

export default OTPInput;
