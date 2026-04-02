'use client';
import Image from 'next/image';
import AppLink from './AppLink';
import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import ProfileCard from "@/components/ProfileCard"; 
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
  };

 // update on mount, on route change, or on storage event
 useEffect(() => {
  const updateLogin = () => setIsLoggedIn(!!localStorage.getItem("authToken"));
  updateLogin();
  window.addEventListener("storage", updateLogin);
  return () => window.removeEventListener("storage", updateLogin);
}, []);

// also update whenever the user navigates
useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem("authToken"));
}, [pathname]);

// scroll listener, click-outside listener, etc…
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
useEffect(() => {
  if (!mobileMenuOpen) return;
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMobileMenuOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [mobileMenuOpen]);


  return (
    <>  
    <nav
    className={`
      fixed inset-x-0 top-0 z-50 h-16 flex items-center
      transition-colors duration-300
      ${scrolled
        ? "bg-white/30 backdrop-blur-md shadow-sm"
        : "bg-transparent"}
    `}
    >
      <div className="w-[98%] mx-auto py-1 sm:py-4 flex justify-between items-center relative">

        {/* Left: Brand - pushed to extreme left */}
        <div className="flex items-center z-20 pl-1">
          <Link href="/">
            <div className="w-30 sm:w-32"> {/* responsive wrapper width */}
              <Image
                src="/icons/icon.png"
                alt="trip Logo"
                width={150} // Keep full resolution
                height={150}
                priority
                className="rounded-full w-full h-auto" // scale visually
              />
            </div>
          </Link>

        </div>

        {/* Hamburger Menu Button (Mobile Only) */}
        <div className="lg:hidden z-20 relative pr-1">
          <button 
            className="text-gray-700 hover:text-teal-500 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>

          {/* Mobile Menu Popup */}
          {mobileMenuOpen && (
            <div 
              ref={menuRef}
              className="
              absolute right-4 top-full mt-2
              w-64
              bg-white/80 backdrop-blur-md
              rounded-lg shadow-lg py-3
              ">
            
              <div className="flex flex-col items-center">
                <Link 
                  href="/" 
                  className="px-5 py-3 text-gray-800 hover:bg-gray-100 hover:text-teal-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/Onboarding" 
                  className="px-5 py-3 text-gray-800 hover:bg-gray-100 hover:text-teal-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Onboarding
                </Link>
                <Link 
                  href="/About" 
                  className="px-5 py-3 text-gray-800 hover:bg-gray-100 hover:text-teal-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                <div className="w-full h-px bg-gray-200 my-2"></div>
                
                {/* Mobile Menu Popup Buttons */}
{/* Mobile Menu Popup Buttons */}
<div className="flex justify-center space-x-2 px-5 py-3">
  {isLoggedIn ? (
    <button
      onClick={() => {
        setShowProfile((v) => !v);
        setMobileMenuOpen(false);
      }}
      className="
        w-auto
        text-center
        px-4 py-2
        bg-white/50 backdrop-blur-sm
        border border-teal-500
        text-teal-600 text-sm font-semibold tracking-wide
        rounded-lg
        hover:bg-cyan-500
        hover:text-gray-600
        transition-colors duration-200
      "
    >
      Profile
    </button>
  ) : (
    <Link
      href="/login"
      onClick={() => setMobileMenuOpen(false)}
      className="
        w-auto
        text-center
        py-2 px-4
        bg-gradient-to-r from-teal-500 to-cyan-500
        border-1 border-white-600
        hover:from-teal-600 hover:to-cyan-600
        text-white text-sm font-bold tracking-wide
        rounded-lg
        shadow-md
        hover:shadow-lg
        transition-all duration-200
      "
    >
      Login
    </Link>
  )}

  <Link
    href="/Onboarding"
    onClick={() => setMobileMenuOpen(false)}
    className="
      w-auto text-center
      py-2 px-4
      bg-white
      border-2 border-teal-500
      hover:bg-teal-50
      text-teal-600 text-sm font-bold tracking-wide
      rounded-lg
      shadow-inner
      shadow-outer
      hover:shadow-md
      transition-all duration-200
    "
  >
    Get Started
  </Link>
</div>


              </div>
            </div>
          )}
        </div>

        {/* Center: Nav Links - absolutely centered (Desktop Only) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center space-x-10">
          <Link href="/" className="relative group font-semibold tracking-wide transition text-gray-700 hover:text-teal-500 focus:text-teal-600 focus:outline-none">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full group-focus:w-full"></span>
          </Link>
          <Link href="/Onboarding" className="relative group font-semibold tracking-wide transition text-gray-700 hover:text-teal-500 focus:text-teal-600 focus:outline-none">
            Onboarding
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full group-focus:w-full"></span>
          </Link>
          <Link href="/About" className="relative group font-semibold tracking-wide transition text-gray-700 hover:text-teal-500 focus:text-teal-600 focus:outline-none">
            About
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full group-focus:w-full"></span>
          </Link>
        </div>

        {/* Right: Login and Get Started - pushed to extreme right (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-4 pr-1">
        {/* Desktop Buttons */}
{isLoggedIn ? (
  <button
    onClick={() => setShowProfile((v) => !v)}
    className="
          inline-flex items-center
          py-2 px-4
          bg-white/50 backdrop-blur-sm
          border border-teal-500
          text-teal-600 text-sm font-semibold tracking-wide
          rounded-lg
           hover:bg-cyan-500
          hover:text-gray-600
          transition-colors duration-200
        "
  >
    Profile
  </button>
) : (
  <Link
    href="/login"
    onClick={() => setMobileMenuOpen(false)}
    className="
      inline-flex items-center
      py-2 px-4
      bg-gradient-to-r from-teal-500 to-cyan-500
      border-1 border-white-600
      hover:from-teal-600 hover:to-cyan-600
      text-white text-sm font-bold tracking-wide
      
      rounded-lg
      shadow-md
      hover:shadow-lg
      transition-all duration-200
    "
  >
    Login
  </Link>
)}

<Link
  href="/Onboarding"
  className="
    inline-flex items-center
    py-2 px-4
    bg-white
    border-2 border-teal-500
    hover:bg-teal-50
    text-teal-600 text-sm font-bold  tracking-wide
    rounded-lg
    shadow-inner
    shadow-outer
    hover:shadow-md
    transition-all duration-200
  "
>
  Get Started
</Link>

        </div>
      </div>
    </nav>
       {/* floating profile card */}
       <ProfileCard open={showProfile} onClose={() => setShowProfile(false)} />
       </>  
  );
};

export default Navbar;