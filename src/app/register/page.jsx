// src/app/register/page.jsx
"use client";

import React, { useState } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";
import GoogleLoginBtn from "@/components/googlelogin";
import AuthShell from "@/components/auth/AuthShell";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPasswordField from "@/components/auth/AuthPasswordField";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthSuccessToast from "@/components/auth/AuthSuccessToast";
import { getFriendlyAuthMessage, normalizeAuthError } from "@/src/utils/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getRegistrationBannerMessage = (normalized) => {
    const usernameError = normalized?.fields?.username?.[0];
    if (usernameError) {
      const lower = String(usernameError).toLowerCase();
      if (lower.includes("already") || lower.includes("taken") || lower.includes("exists")) {
        return "That username is already in use. Please choose another one.";
      }
      return usernameError;
    }

    const emailError = normalized?.fields?.email?.[0];
    if (emailError) return emailError;

    const passwordError =
      normalized?.fields?.password1?.[0] ||
      normalized?.fields?.password2?.[0];
    if (passwordError) return passwordError;

    return getFriendlyAuthMessage(
      null,
      normalized?.message || "Registration failed.",
      "register"
    );
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
    if (isSubmitting) return;
  
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
    setIsSubmitting(true);
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
      const normalized = normalizeAuthError(err, "Registration failed.");
      const friendlyMessage = getRegistrationBannerMessage(normalized);
      console.error("Registration error payload:", err?.response?.data || err);
      setErrors({
        ...normalized.fields,
        non_field_errors: [friendlyMessage],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create Account" subtitle="Join tripbozo and start building smarter trips">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {errors.non_field_errors && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errors.non_field_errors.join(" ")}
          </p>
        )}

        <AuthTextField
          id="username"
          label="Username"
          type="text"
          value={form.username}
          onChange={handleChange}
          errors={errors.username || []}
          required
        />

        <AuthTextField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          errors={errors.email || []}
          required
        />

        <AuthPasswordField
          id="password1"
          label="Password"
          value={form.password1}
          onChange={handleChange}
          show={showPass1}
          onToggle={() => setShowPass1((v) => !v)}
          errors={errors.password1 || []}
          required
        />

        <AuthPasswordField
          id="password2"
          label="Confirm Password"
          value={form.password2}
          onChange={handleChange}
          show={showPass2}
          onToggle={() => setShowPass2((v) => !v)}
          errors={errors.password2 || []}
          required
        />

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={registrationSuccess || isSubmitting}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            ) : null}
            {registrationSuccess
              ? "Registered"
              : isSubmitting
              ? "Creating account..."
              : "Register"}
          </span>
        </button>
      </form>

      <AuthDivider text="or continue with" />
      <GoogleLoginBtn text="signup_with" />

      <button
        className="mt-3 w-full text-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        onClick={() => router.push("/login")}
      >
        Already have an account? Login
      </button>

      {registrationSuccess && <AuthSuccessToast message="Registration successful" />}
    </AuthShell>
  );
}