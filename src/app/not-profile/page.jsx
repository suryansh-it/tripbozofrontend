"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

export default function ProfilePage() {
  // Simulate fetching user data from localStorage or use sample data if none exists
  let initialData;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('authToken');
    if (stored) {
      initialData = JSON.parse(stored);
    } else {
      initialData = {
        name: "Aarav Sharma",
        username: "aarav_travels",
        email: "aarav.sharma@email.com",
        dp: null,
      };
    }
  } else {
    initialData = {
      name: "Aarav Sharma",
      username: "aarav_travels",
      email: "aarav.sharma@email.com",
      dp: null,
    };
  }

  const [profile, setProfile] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [dpPreview, setDpPreview] = useState(profile.dp);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress image before storing to localStorage
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.onload = () => {
          // Create a canvas to resize/compress
          const canvas = document.createElement('canvas');
          const maxDim = 128; // Limit DP size
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG, quality 0.7
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setDpPreview(dataUrl);
          setProfile((prev) => ({ ...prev, dp: dataUrl }));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditMode(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('profileData', JSON.stringify(profile));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/80 via-blue-900/40 to-teal-400/20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="relative mb-6">
          <div
            className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-teal-400 shadow"
            onClick={() => editMode && fileInputRef.current.click()}
            style={{ cursor: editMode ? 'pointer' : 'default' }}
            title={editMode ? 'Change profile picture' : ''}
          >
            {dpPreview ? (
              <div className="w-full h-full relative">
                <Image 
                  src={dpPreview} 
                  alt="Profile" 
                  fill 
                  sizes="112px"
                  className="object-cover" 
                />
              </div>
            ) : (
              <span className="text-4xl text-gray-400">👤</span>
            )}
          </div>
          {editMode && (
            <button
              className="absolute bottom-2 right-2 bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-600 transition"
              onClick={() => fileInputRef.current.click()}
              type="button"
              title="Change profile picture"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleDpChange}
          />
        </div>
        <form className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-extrabold text-gray-800">Profile</h1>
            {!editMode && (
              <button
                type="button"
                className="text-teal-500 hover:text-teal-700 p-2 rounded-full"
                onClick={() => setEditMode(true)}
                title="Edit profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
              </button>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
              value={profile.name}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username</label>
            <input
              name="username"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
              value={profile.username}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
              value={profile.email}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          {editMode && (
            <button
              type="button"
              className="w-full py-3 rounded-full bg-teal-500 text-white font-bold text-lg shadow-md hover:bg-teal-600 transition"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </form>
        {/* Logout Button */}
        {!editMode && (
          <button
            type="button"
            className="mt-8 w-full py-2 rounded-full bg-red-100 text-red-600 font-semibold text-base hover:bg-red-500 hover:text-white transition shadow"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('profileData');
                window.location.href = '/';
              }
            }}
          >
            Logout
          </button>
        )}
      </div>
    </main>
  );
}
