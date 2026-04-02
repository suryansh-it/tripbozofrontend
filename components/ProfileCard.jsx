// src/components/ProfileCard.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiUser, FiLogOut, FiTrash2 } from "react-icons/fi";

export default function ProfileCard({ open, onClose }) {
  const ref = useRef();
  const [user, setUser] = useState(null);
  const rawToken =
    typeof window !== "undefined" && localStorage.getItem("authToken");

  // click‐outside to close
  useEffect(() => {
    const onClick = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  // fetch user
  useEffect(() => {
    if (!open || !rawToken) return;
    const isJwt = rawToken.split(".").length === 3;
    const headerValue = isJwt ? `Bearer ${rawToken}` : `Token ${rawToken}`;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/`, {
        headers: { Authorization: headerValue },
      })
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, [open, rawToken]);

  if (!open) return null;

  // shared clear function
  const clearAuth = () => {
    localStorage.removeItem("authToken");
  };

  const handleLogout = () => {
    clearAuth();
    window.location.reload();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "This will permanently delete your account. Are you sure you want to proceed?"
      )
    ) {
      return;
    }

    // pick correct header
    const isJwt = rawToken.split(".").length === 3;
    const headerValue = isJwt ? `Bearer ${rawToken}` : `Token ${rawToken}`;

    try {
      // server‐side delete
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/delete/`,
        { headers: { Authorization: headerValue } }
      );
    } catch (err) {
      console.error("Failed to delete account on server:", err);
      alert("Could not delete your account. Please try again.");
      return;
    }

    // now purge local data
    clearAuth();
    localStorage.removeItem("profileData");
    window.location.reload();
  };

  return (
    <div
      ref={ref}
      className="
        fixed top-16 right-4 w-64 bg-white rounded-2xl shadow-xl
        ring-1 ring-black/10 overflow-hidden z-50
        animate-fade-in-down
      "
    >
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <FiUser size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {user?.username || "—"}
            </p>
            <p className="text-sm text-gray-500">{user?.email || "—"}</p>
          </div>
        </div>
        {/* two small buttons side-by-side */}
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="
              flex-1 flex items-center justify-center gap-1
              py-1 px-2
              bg-red-100 text-red-600 text-sm font-medium
              rounded-lg
              hover:bg-red-500 hover:text-white
              transition
            "
          >
            <FiLogOut size={16}/> Logout
          </button>
          <button
            onClick={handleDelete}
            className="
              flex-1 flex items-center justify-center gap-1
              py-1 px-2
              bg-gray-100 text-gray-700 text-sm font-medium
              rounded-lg
              hover:bg-gray-300
              transition
            "
          >
            <FiTrash2 size={16}/> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
