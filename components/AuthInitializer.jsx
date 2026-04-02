// src/components/AuthInitializer.jsx
"use client";

import { useEffect } from "react";
import axios from "axios";

export default function AuthInitializer() {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const isJwt = token.split(".").length === 3;
      axios.defaults.headers.common["Authorization"] = isJwt
        ? `Bearer ${token}`
        : `Token ${token}`;
    }
  }, []);

  // This component renders nothing visible
  return null;
}
