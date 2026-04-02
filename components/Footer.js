import React from 'react';
import Image from 'next/image';
import AppLink from './AppLink';
import { FiInstagram, FiLinkedin, FiMail,} from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6'; 

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-8 md:pt-10 pb-8 md:pb-10 w-full">
      <div className="w-[92vw] max-w-[1800px] mx-auto px-4 md:px-6">
        {/* Grid layout with responsive changes */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-y-8 md:gap-y-6 md:gap-x-8 items-start md:items-start text-center md:text-left">
          {/* Logo and Description - centered on mobile */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2">
            {/* <Image
                src="/logo.png" // Path to your logo in the public directory
                alt="Trip Bozo Logo"
                width={40}  // Adjust width as needed
                height={40} // Adjust height as needed
                className="rounded-full" // Optional: if your logo is circular
              /> */}
              <span className="font-display text-xl sm:text-lg font-bold">tripbozo</span>
            </div>
            <p className="text-gray-400 text-xs italic -mt-1">Less googling, more going.</p>
            <p className="text-gray-300 text-xs">Your essential companion for seamless travel experiences worldwide.</p>
             <br></br>
             {/* Contact Us Buttons */}
      <div className="mt-4 flex justify-center items-center space-x-5">
        <a
          href="https://www.instagram.com/tripbozo?utm_source=qr&igsh=MXRxcjFrMnA2Nmo2Yg=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-gray-600 hover:text-teal-500 transition-colors"
        >
          <FiInstagram size={20} />
        </a>
        <a
          href="https://www.linkedin.com/company/107882785/admin/dashboard/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-gray-600 hover:text-teal-500 transition-colors"
        >
          <FiLinkedin size={20} />
        </a>
        <a
          href="mailto:bozotrip@gmail.com"
          aria-label="Email us"
          className="text-gray-600 hover:text-teal-500 transition-colors"
        >
          <FiMail size={20} />
        </a>
        <a
          href="https://x.com/tripbozo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="text-gray-600 hover:text-teal-500 transition-colors"
        >
          <FaXTwitter size={20} />
        </a>
      </div>
          </div>

          {/* Quick Links - centered on mobile and desktop */}
          <div className="flex flex-col items-center md:flex md:justify-center md:items-center">
            <h4 className="font-display text-lg sm:text-base font-bold mb-2 text-center">Quick Links</h4>
            <ul className="space-y-1 text-center">
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/">Home</AppLink></li>
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/Onboarding">Onboarding</AppLink></li>
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/About">About Us</AppLink></li>
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/contact">Contact Us</AppLink></li>
            </ul>
            <div className="w-[70%] h-px bg-white/30 mt-4 md:hidden"></div>
          </div>

          {/* Popular Destinations - centered on mobile */}
          <div className="flex flex-col items-center md:items-start md:justify-self-end">
            <h4 className="font-display text-lg sm:text-base font-bold mb-2">Popular Destinations</h4>
            <ul className="space-y-1">
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/country/jp">Japan 🇯🇵</AppLink></li>
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/country/fr">France 🇫🇷</AppLink></li>
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/country/us">United States 🇺🇸</AppLink></li>
              <li><AppLink className="text-gray-300 hover:text-white transition-colors text-sm" href="/country/th">Thailand 🇹🇭</AppLink></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and Legal - centered on mobile */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-gray-400 text-xs flex flex-col md:flex-row justify-between items-center w-full">
          <p className="mb-2 md:mb-0 text-center md:text-left">© {new Date().getFullYear()} tripbozo. All rights reserved.</p>
          
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-center md:text-right space-y-1 md:space-y-0">
            <p className="text-gray-400">Hero images via Pixabay</p>
            <AppLink href="/privacy" className="hover:text-white transition-colors">Privacy Policy</AppLink>
            <AppLink href="/terms" className="hover:text-white transition-colors">Terms of Service</AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;