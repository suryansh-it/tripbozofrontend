// src/app/login/page.jsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import GoogleLoginBtn from "@/components/googlelogin";
import AuthShell from "@/components/auth/AuthShell";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPasswordField from "@/components/auth/AuthPasswordField";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthSuccessToast from "@/components/auth/AuthSuccessToast";
import { getFriendlyAuthMessage, normalizeAuthError } from "@/src/utils/api";


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
      const normalized = normalizeAuthError(err, "Login failed. Please try again.");
      const friendlyMessage = getFriendlyAuthMessage(
        err,
        normalized.message || "Login failed. Please try again.",
        "login"
      );

      console.error("Login error:", err?.response?.data || err);
      setErrors({
        ...clientErrors,
        ...normalized.fields,
        non_field_errors: [friendlyMessage],
      });
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue planning with tripbozo">
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        {errors.non_field_errors && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errors.non_field_errors.join(" ")}
          </p>
        )}

        <AuthTextField
          id="identifier"
          label="Email or Username"
          value={form.identifier}
          onChange={handleChange}
          placeholder="you@example.com or username"
          errors={errors.identifier || []}
          required
        />

        <AuthPasswordField
          id="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          errors={errors.password || []}
          required
        />

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-slate-800"
        >
          Login
        </button>
      </form>

      <AuthDivider text="or continue with" />
      <GoogleLoginBtn text="signin_with" />

      <button
        className="mt-3 w-full text-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        onClick={() => router.push("/register")}
      >
        Don&apos;t have an account? Register
      </button>

      {loginSuccess && <AuthSuccessToast message="Login successful" />}
    </AuthShell>
  );
}