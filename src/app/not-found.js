"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [formData, setFormData] = useState({
    country: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  // Check authentication status on mount and listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
      if (token) {
        setIsAuthenticated(true);
        setAuthToken(token);
      } else {
        setIsAuthenticated(false);
        setAuthToken('');
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., when user logs in on another tab or after redirect)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'access_token' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper to check if user is authenticated (checks localStorage directly, only safe in handlers)
  const checkIsAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!(localStorage.getItem('authToken') || localStorage.getItem('access_token'));
  };

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('authToken') || localStorage.getItem('access_token') || '';
  };

  const sendSuggestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = getAuthToken();
    if (!token) {
      setSubmitStatus({ success: false, message: "Please log in first to submit a suggestion." });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/suggest-country/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok && data.result === "success") {
        setSubmitStatus({ success: true, message: "Suggestion submitted successfully!" });
        setFormData({ country: '', message: '' });
        setTimeout(() => setShowForm(false), 2000);
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenForm = () => {
    // Fresh check of authentication
    if (!checkIsAuthenticated()) {
      setSubmitStatus({ success: false, message: "Please log in to submit a suggestion. Redirecting..." });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#f5fafd] to-[#e3f2fd] p-4 relative">
      {/* Success/Error Toast */}
      {submitStatus.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all ${
          submitStatus.success ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {submitStatus.message}
          <button 
            onClick={() => setSubmitStatus({ message: '' })} 
            className="ml-4 text-xl"
          >
            &times;
          </button>
        </div>
      )}

      {/* Suggestion Form Modal */}
      {showForm && isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Suggest a Country</h2>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={sendSuggestion} className="space-y-4">
                <div>
                  <label htmlFor="country" className="block text-gray-700 mb-1">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Which country are you suggesting?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-1">
                    Why should we add it? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Tell us why this country would be valuable for travelers..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600'
                  } text-white transition-colors`}
                >
                  {isSubmitting ? 'Submitting...' : 'Send Suggestion'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center relative z-10">
        <div className="text-8xl mb-6">😕</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Country Not Found!</h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn&apos;t find apps for the country you searched.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          But don&apos;t worry — we&apos;re constantly adding new countries and their must-have apps!
        </p>
        
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-blue-800 font-medium">
              👉 Stay tuned! Your destination might be next on our radar.
            </p>
          </div>

          {/* Help users know they need to login */}
          {!isAuthenticated && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-amber-900 font-medium text-sm">
                💡 <strong>Tip:</strong> Log in to submit your country suggestion!
              </p>
            </div>
          )}
          
          <div className="flex flex-col space-y-4">
            <Link 
              href="/"
              className="inline-flex justify-center items-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              Explore Other Destinations
            </Link>
            
            <button
              onClick={handleOpenForm}
              className={`inline-flex justify-center items-center px-6 py-3 border border-teal-500 font-medium rounded-lg transition-colors ${
                isAuthenticated
                  ? 'text-teal-500 hover:bg-teal-50 cursor-pointer'
                  : 'text-gray-400 border-gray-300 bg-gray-50 cursor-not-allowed'
              }`}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Log in to submit a suggestion" : ""}
            >
              {isAuthenticated ? 'Send Us a Suggestion' : 'Log in to Suggest a Country'}
            </button>

            {!isAuthenticated && (
              <Link 
                href="/login"
                className="inline-flex justify-center items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}