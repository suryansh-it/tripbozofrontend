// app/contact/page.jsx


import React from "react";
import { FiInstagram, FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";
import AppLink from "@/components/AppLink";
import { FaXTwitter } from 'react-icons/fa6';

export const metadata = {
  title: "Contact Us | tripBozo",
};

export default function ContactPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Contact Us
        </h1>

        <p className="text-gray-700">
          We’d love to hear from you! Reach out via any of the channels below.
        </p>

        {/* Email */}
        <div className="flex items-center justify-center space-x-3">
          <FiMail size={24} className="text-teal-500" />
          <a
            href="mailto:bozotrip@gmail.com"
            className="text-lg text-gray-900 hover:text-teal-600 transition-colors"
          >
            bozotrip@gmail.com
          </a>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center space-x-6">
          {[ 
            { Icon: FiInstagram, href: "https://www.instagram.com/tripbozo?utm_source=qr&igsh=MXRxcjFrMnA2Nmo2Yg==" },
            { Icon: FiLinkedin, href: "https://www.linkedin.com/company/107882785/" },
            { Icon: FaXTwitter , href: "https://x.com/tripbozo" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-teal-500 transition-colors"
            >
              <Icon size={28} />
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="flex justify-center space-x-6">
          <AppLink
            href="/"
            className="text-gray-700 hover:text-teal-600 transition-colors"
          >
            Home
          </AppLink>
          <AppLink
            href="/privacy"
            className="text-gray-700 hover:text-teal-600 transition-colors"
          >
            Privacy Policy
          </AppLink>
          <AppLink
            href="/terms"
            className="text-gray-700 hover:text-teal-600 transition-colors"
          >
            Terms of Service
          </AppLink>
        </div>
      </div>
    </main>
  );
}
