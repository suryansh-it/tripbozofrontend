"use client";
import React from 'react';
import Link from 'next/link';

export default function ErrorPage({ statusCode, errorType }) {
  // Determine type of error
  const isOffline = errorType === 'offline';
  const is404 = statusCode === 404;
  const is500 = statusCode === 500 || (!isOffline && !is404);

  // Configure content based on error type
  let title = 'Something went wrong';
  let message = 'We apologize for the inconvenience. Please try again later.';
  let emoji = '🔧';
  let actionText = 'Go Home';
  let actionLink = '/';

  if (is404) {
    title = 'Page Not Found';
    message = 'The page you are looking for does not exist or has been moved.';
    emoji = '🧭';
  } else if (isOffline) {
    title = 'You are offline';
    message = 'Please check your internet connection and try again.';
    emoji = '📶';
    actionText = 'Retry';
    actionLink = window.location.pathname;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#f5fafd] to-[#e3f2fd] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-8xl mb-6">{emoji}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href={actionLink}
            className="inline-flex justify-center items-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            {actionText}
          </Link>
          
          <a 
            href="mailto:support@tripbozo.com"
            className="text-teal-500 hover:text-teal-700 underline transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 