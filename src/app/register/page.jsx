// src/app/register/page.jsx
"use client";

import React, { useState } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";
import GoogleLoginBtn from "@/components/googlelogin";
// import FacebookLoginBtn from "@/components/fblogin";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validateUsername = (username) => {
    const messages = [];
    if (username.length < 3) {
      messages.push("Username must be at least 3 characters long.");
    }
    if (/\s/.test(username)) {
      messages.push("Username cannot contain spaces.");
    }
    return messages;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (password) => {
    const messages = [];
    if (password.length < 8) {
      messages.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      messages.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      messages.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      messages.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      messages.push("Password must contain at least one special character.");
    }
    return messages;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));

    // live‐validate…
    let newErrors = { ...errors };
    if (id === "username") {
      newErrors.username = validateUsername(value);
    } else if (id === "email") {
      const msg = validateEmail(value);
      newErrors.email = msg ? [msg] : [];
    } else if (id === "password1") {
      newErrors.password1 = validatePassword(value);
      if (form.password2 && value !== form.password2) {
        newErrors.password2 = ["Passwords do not match."];
      } else {
        delete newErrors.password2;
      }
    } else if (id === "password2") {
      if (value !== form.password1) {
        newErrors.password2 = ["Passwords do not match."];
      } else {
        delete newErrors.password2;
      }
    }
    Object.keys(newErrors).forEach(k => {
      if (Array.isArray(newErrors[k]) && newErrors[k].length === 0) delete newErrors[k];
    });
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // client-side validations…
    let clientErrors = {};
    const uErr = validateUsername(form.username);
    if (uErr.length) clientErrors.username = uErr;
    const eErr = validateEmail(form.email);
    if (eErr) clientErrors.email = [eErr];
    const pErr = validatePassword(form.password1);
    if (pErr.length) clientErrors.password1 = pErr;
    if (form.password1 !== form.password2)
      clientErrors.password2 = ["Passwords do not match."];
  
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }
  
    setErrors({});
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration/`,
        {
          username: form.username,
          email: form.email,
          password1: form.password1,
          password2: form.password2,
        }
      );
  
           // ── AUTO-LOGIN FALLBACK ────────────────────────────────────────────────
           // registration succeeded but no token came back? now call JWT create:
             // 2) Auto-login fallback
    let token;
    if (res.data.access || res.data.key) {
      token = res.data.access ?? res.data.key;
    } else {
      const loginRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/jwt/create/`,
        { username: form.username, password: form.password1 }
      );
      token = loginRes.data.access;
    }
    localStorage.setItem("authToken", token);
    const isJwt = token.split(".").length === 3;
    axios.defaults.headers.common["Authorization"] = isJwt
      ? `Bearer ${token}`
      : `Token ${token}`;


   
      // show toast & redirect
      setRegistrationSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error("Registration error payload:", err.response?.data);
      setErrors(err.response?.data || { non_field_errors: ["Registration failed."] });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4">
      {/* full‐screen gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/80 via-blue-900/40 to-teal-400/20 pointer-events-none" />

      {/* glassy card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Register
        </h1>
        <p className="text-gray-700 mb-6 text-center">
          Create your tripbozo account
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {errors.non_field_errors && (
            <p className="text-red-500 text-sm">{errors.non_field_errors.join(" ")}</p>
          )}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-800 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              // --- UI/UX Improvement: Text, Background, Shadow ---
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 shadow-sm"
              required
            />
            {errors.username && (
              <ul className="text-red-500 text-sm mt-1 list-disc list-inside">
                {errors.username.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-800 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              // --- UI/UX Improvement: Text, Background, Shadow ---
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 shadow-sm"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.join(" ")}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password1" className="block text-gray-800 mb-1">
              Password
            </label>
            <div className="flex w-full">
              <input
                id="password1"
                type={showPass1 ? "text" : "password"}
                value={form.password1}
                onChange={handleChange}
                // --- UI/UX Improvement: Text, Background, Shadow ---
                className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 shadow-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                // --- UI/UX Improvement: Match Background and Shadow ---
                className="px-3 py-3 rounded-r-lg border border-l-0 border-gray-300 text-sm text-teal-600 hover:text-teal-800 focus:outline-none bg-white shadow-sm"
                onClick={() => setShowPass1(v => !v)}
                aria-label={showPass1 ? "Hide password" : "Show password"}
              >
                {showPass1 ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password1 && (
              <ul className="text-red-500 text-sm mt-1 list-disc list-inside">
                {errors.password1.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="password2" className="block text-gray-800 mb-1">
              Confirm Password
            </label>
            <div className="flex w-full">
              <input
                id="password2"
                type={showPass2 ? "text" : "password"}
                value={form.password2}
                onChange={handleChange}
                // --- UI/UX Improvement: Text, Background, Shadow ---
                className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 shadow-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                // --- UI/UX Improvement: Match Background and Shadow ---
                className="px-3 py-3 rounded-r-lg border border-l-0 border-gray-300 text-sm text-teal-600 hover:text-teal-800 focus:outline-none bg-white shadow-sm"
                onClick={() => setShowPass2(v => !v)}
                aria-label={showPass2 ? "Hide password" : "Show password"}
              >
                {showPass2 ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password2 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password2.join(" ")}
              </p>
            )}
          </div>

           {/* Submit */}
           <button
            type="submit"
            className="w-full py-3 rounded-full bg-teal-500 text-white font-bold text-lg shadow-md hover:bg-teal-600 transition"
            disabled={registrationSuccess}
          >
            {registrationSuccess ? "✓ Registered" : "Register"}
          </button>
        </form>

 {/* ── OR Separator ── */}
       {/* <div className="my-6 flex items-center">
         <hr className="flex-grow border-gray-300" />
         <span className="px-2 text-gray-500">or</span>
         <hr className="flex-grow border-gray-300" />
       </div> */}

       {/* Google OAuth Button */}
       {/* <GoogleLoginBtn
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
              /> */}

        <button
          className="mt-4 w-full text-center text-sm text-teal-600 hover:underline"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </button>
      </div>

      {/* success toast */}
      {registrationSuccess && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-teal-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-gray-800 font-medium">Registration successful!</span>
        </div>
      )}
    </div>
  );
}