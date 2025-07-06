// src/app/login/page.jsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import GoogleLoginBtn from "@/components/googlelogin";
// import FacebookLoginBtn from "@/components/fblogin";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
    // Clear the specific error message as the user starts typing again
    if (errors[e.target.id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.id];
        return newErrors;
      });
    }
    // Also clear non_field_errors if user starts typing in any field
    if (errors.non_field_errors) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.non_field_errors;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let clientErrors = {};

    // Client-side validation for empty fields
      
        if (!form.identifier.trim()) {
          clientErrors.identifier = ["Please enter your email or username."];
        }
        if (!form.password) {
          clientErrors.password = ["Please enter your password."];
        }

    // If client-side errors exist, set them and stop submission
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({}); // Clear any previous errors before making the API call
    try {
      
// decide if identifier looks like an email:
      const isEmail = form.identifier.includes("@");
      const payload = isEmail
        ? { email: form.identifier.trim(), password: form.password }
        : { username: form.identifier.trim(), password: form.password };
           // NEW: hit the JWT create endpoint
           const res = await axios.post(
             `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/jwt/create/`,
             payload
           );
           const token = res.data.access;  // this is the JWT
      localStorage.setItem("authToken", token);


// tell axios to send it on every request
const isJwt = token.split(".").length === 3;
axios.defaults.headers.common["Authorization"] = 
  isJwt
    ? `Bearer ${token}`
    : `Token ${token}`;


           // show toast, then redirect
     setLoginSuccess(true);
     setTimeout(() => {
       router.push("/");
     }, 1500);
    } catch (err) {
      console.error("Login error payload:", err.response?.data);
      const data = err.response?.data || {};
      // Merge clientErrors with server errors, if any.
      // Server errors take precedence or add more specific info.
      setErrors({ ...clientErrors, ...data });
    }
  };

  return (
    <div className="relative w-full min-h-screen">
    {/* fixed full-screen gradient behind everything */}
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/80 via-blue-900/40 to-teal-400/20 -z-10" />

    <main className="min-h-screen flex items-center justify-center">
      {/* Main Glassy Card - Updated to match register page for consistency */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 transform transition-transform hover:-translate-y-1 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Login</h1>
        <p className="text-gray-500 mb-4 text-center">Sign in to your tripbozo account</p>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {errors.non_field_errors && (
            <p className="text-red-500 text-sm">{errors.non_field_errors.join(" ")}</p>
          )}

          {/* Email (or Username) Input - updated for classy UI */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              value={form.identifier}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 shadow-sm"
              placeholder="you@example.com or username"
            />
            {/* Display combined errors for email/username input field */}
            {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.identifier.join(" ")}
                </p>
            )}
          </div>

          {/* Password Input - REMOVED EYE EMOJI, ADDED HIDE/SHOW BUTTON */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            {/* Flex container to hold input and show/hide button side-by-side */}
            <div className="flex w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 shadow-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="px-3 py-3 rounded-r-lg border border-l-0 border-gray-300 text-sm text-teal-600 hover:text-teal-800 focus:outline-none bg-white shadow-sm"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.join(" ")}</p>}
          </div>

          {/* Login Button - updated for classy UI and centering */}
          <button
            type="submit"
            className="
              max-w-[200px]         /* Max width of 200px */
              mx-auto               /* Center the button */
              py-2    
              px-8              /* Reduced vertical padding */
              rounded-full          /* Keep full rounding */
              bg-gradient-to-r from-teal-500 to-teal-600 /* Subtle gradient */
              text-white            /* White text */
              font-semibold         /* Slightly less bold */
              text-base             /* Smaller font size */
              shadow-lg             /* Larger initial */
              hover:from-teal-600 hover:to-teal-700 /* Darker gradient on hover */
              hover:shadow-xl       /* Larger  on hover */
              hover:-translate-y-0.5 /* Subtle lift on hover */
              transition-all duration-300 ease-in-out /* Smooth transitions */
            "
          >
            Login
          </button>
        </form>
{/* ── OR Separator ── */}
       <div className="my-6 flex items-center">
         <hr className="flex-grow border-gray-300" />
         <span className="px-2 text-gray-500">or</span>
         <hr className="flex-grow border-gray-300" />
       </div>
        {/* Google OAuth Button (smaller, classy) */}
       <GoogleLoginBtn
         className="
           w-full
           px-4 py-2
           rounded-lg
           bg-white
           border border-gray-200
           text-gray-700 text-sm
           font-medium
           flex items-center justify-center space-x-2
           shadow-sm
           hover:bg-gray-50
           transition
         "
       />

        {/* Redirect to Register Link - now full width with centered text */}
        <button
          className="mt-4 w-full text-center text-sm text-teal-600 hover:underline"
          onClick={() => router.push("/register")}
        >
          Don&apos;t have an account? Register
        </button>
      </div>
    </main>
         {/* login success toast */}
     {loginSuccess && (
       <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up">
         ✓ Login Successful!
       </div>
     )}
</div>
  );
}