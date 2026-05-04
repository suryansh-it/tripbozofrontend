"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useLoader } from '@/components/LoaderContext';

export default function AboutPageClient() {
  const { setShow } = useLoader();
  const [form, setForm] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleStartNow = () => {
    setShow(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('authToken') || localStorage.getItem('access_token')
        : null;

    if (!token) {
      setSubmitStatus({
        success: false,
        message: 'Please log in to submit feedback. Redirecting to login...',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/feedback/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok && data.result === 'success') {
        setSubmitStatus({ success: true, message: 'Feedback sent successfully. Thank you!' });
        setForm({ name: '', message: '' });
      } else {
        throw new Error(data.message || 'Feedback submission failed');
      }
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: err?.message || 'Something went wrong while submitting feedback.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const splitFeatureText = (text) => {
    const idx = text.indexOf('. ');
    if (idx === -1) return { lead: text, rest: '' };
    return {
      lead: text.slice(0, idx + 1),
      rest: text.slice(idx + 2),
    };
  };

  const features = [
    {
      icon: '📱',
      title: 'Curated App Collections',
      text: 'See the best travel apps for each destination in one place, with direct install links, alternatives, and ratings. It cuts out the noise and helps travelers choose faster for navigation, rides, payments, translation, and local discovery. You spend less time comparing random apps and more time preparing a bundle that actually fits your trip style.',
      align: 'left',
      bg: 'bg-cyan-100',
    },
    {
      icon: '🧾',
      title: 'Traveler-Verified Picks',
      text: 'We pay attention to real traveler feedback and usage signals from across the web before including an app. That means the recommendations are not just based on app-store style ratings, but also on how actual travelers talk about the tools they relied on in real trips. The goal is to surface apps that feel proven, practical, and worth trusting before you download.',
      align: 'right',
      bg: 'bg-violet-100',
    },
    {
      icon: '🚨',
      title: 'Comprehensive Travel Essentials',
      text: 'Find emergency contacts, embassy help, phrases, transit basics, payment tips, scam warnings, and offline-ready guidance. Everything important is grouped into one easy reference, so travelers can act quickly before and during a trip. Instead of searching multiple sites in a stressful moment, the core information is already organized and ready to use.',
      align: 'right',
      bg: 'bg-yellow-100',
    },
    {
      icon: '🛰️',
      title: 'Live Travel Updates',
      text: 'Stay on top of the latest travel alerts, weather changes, local advisories, and country updates without hunting across multiple sources. The updates are organized into clear categories, so the most useful information rises to the top instead of getting buried in noise. This helps travelers react faster when conditions change and keep their plans realistic.',
      align: 'left',
      bg: 'bg-emerald-100',
    },
    {
      icon: '🗺️',
      title: 'Country Travel Guide',
      text: 'Open a destination guide that connects app picks with local travel reality and your selected origin country. It shows what matters most for that country, from transport and safety to connectivity, money habits, and relevant embassy help, so the suggestions feel practical instead of generic. This helps users understand not just what to install, but why each recommendation is useful in that specific place.',
      align: 'left',
      bg: 'bg-blue-100',
    },
    {
      icon: '🧭',
      title: 'Personalized Onboarding',
      text: 'A short intro explains how tripbozo works and lets you save your origin country. That makes the guidance feel more relevant from the first visit, with better support and less guesswork. The setup stays lightweight, but still gives enough context to personalize Essentials and improve the quality of recommendations.',
      align: 'right',
      bg: 'bg-teal-100',
    },
  ];

  return (
    <>
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Trip Bozo',
            url: 'https://tripbozo.com',
            logo: 'https://tripbozo.com/logo.png',
            description:
              'tripbozo helps travelers discover destination-specific app bundles chosen from traveler feedback and practical selection criteria, plus Essentials guidance, live travel updates, origin-aware assistance, and helpful travel tools that make each trip easier to plan and safer to enjoy.',
            sameAs: [
              'https://twitter.com/tripbozo',
              'https://facebook.com/tripbozo',
              'https://instagram.com/tripbozo',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@tripbozo.com',
              contactType: 'customer service',
            },
          }),
        }}
      />

      <main className="bg-gradient-to-br from-[#e0f7fa] via-[#f5fafd] to-[#e3f2fd] text-gray-800 w-full min-h-screen">
        <section className="w-full bg-gradient-to-r from-[#38bdf8] via-[#2ad2c9] to-[#5eead4] text-white py-16 sm:py-24 px-4 sm:px-8 text-center relative overflow-hidden">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight animate-fade-in-up relative z-10">
            Your Essential
            <br className="hidden sm:block" /> Travel Companion
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto mb-8 text-white/90 font-medium drop-shadow animate-fade-in-up delay-200 relative z-10">
            tripbozo curates destination-ready app bundles, practical Essentials, and country-specific guidance so you can spend less time searching and more time traveling.
          </p>
        </section>

        <section className="w-[85%] sm:w-[90%] mx-auto -mt-8 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that <span className="text-teal-600 font-semibold">technology should make travel feel easier, clearer, and more confident</span>, not add extra friction. Our mission is to help travelers find the right digital tools for the right destination, with recommendations that save time, reduce guesswork, and support better decisions before and during a trip.
              </p>
            </div>
            <div className="md:w-1/3 bg-gradient-to-br from-teal-50 to-blue-50 p-8 flex items-center justify-center">
              <span className="text-7xl">🌍</span>
            </div>
          </div>
        </section>

        <section className="w-full py-24 sm:py-28 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 text-center mb-12 sm:mb-20">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
                Key Features
              </span>
            </h2>

            {features.map((feat, i) => {
              const parts = splitFeatureText(feat.text);
              return (
                <div
                  key={i}
                  className={`group mb-24 sm:mb-28 flex flex-col ${feat.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 sm:gap-14`}
                >
                  <div className="md:w-1/3 flex justify-center">
                    <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl ${feat.bg} flex items-center justify-center shadow-lg overflow-hidden group-hover:shadow-2xl transition-all duration-300`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                      <span className="relative text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">{feat.icon}</span>
                    </div>
                  </div>
                  <div className={`md:w-[68%] text-center ${feat.align === 'right' ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-2xl sm:text-[2rem] font-extrabold tracking-tight text-slate-900 mb-3 sm:mb-4">
                      <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent group-hover:from-cyan-700 group-hover:to-blue-700 transition-all duration-300">
                        {feat.title}
                      </span>
                    </h3>
                    <div className={`mb-4 sm:mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 ${feat.align === 'right' ? 'ml-auto' : 'mr-auto'} opacity-80 group-hover:w-28 transition-all duration-300`} />
                    <div className="mx-auto max-w-4xl px-1 sm:px-0">
                      <p className="text-[1.02rem] sm:text-[1.08rem] text-slate-700 leading-8 sm:leading-[2.05rem] group-hover:text-slate-800 transition-colors duration-300">
                        <span className="font-semibold text-slate-900">{parts.lead}</span>
                      </p>
                      {parts.rest ? (
                        <p className="mt-3 sm:mt-4 text-[0.98rem] sm:text-[1.05rem] text-slate-600 leading-8 sm:leading-[1.95rem]">
                          {parts.rest}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="w-full py-12 bg-gradient-to-r from-[#2ad2c9]/10 via-[#38bdf8]/10 to-[#5eead4]/10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: '25+', label: 'Countries Covered' },
                { num: '300+', label: 'Curated Apps' },
                { num: '1k+', label: 'Happy Travelers' },
                { num: '4.5', label: 'Average Rating' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-bold text-teal-500 mb-2">{stat.num}</span>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-gradient-to-r from-[#2ad2c9] via-[#38bdf8] to-[#5eead4] text-white py-20 sm:py-28 px-4 sm:px-8 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl font-extrabold drop-shadow-lg">We'd Love Your Feedback</h2>
              <p className="text-white/90 text-lg mt-3 sm:mt-4">Help us improve tripbozo by sharing your thoughts and suggestions</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-gray-800 space-y-6 max-w-2xl mx-auto"
            >
              <div>
                <label htmlFor="feedback-name" className="block text-gray-700 font-semibold mb-2">
                  Your Name
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="feedback-message" className="block text-gray-700 font-semibold mb-2">
                  Your Feedback
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  placeholder="Tell us what you think about tripbozo..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {submitStatus.message ? (
                <div
                  className={`p-4 rounded-lg text-sm font-medium ${
                    submitStatus.success 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                      : 'bg-rose-100 text-rose-700 border border-rose-300'
                  }`}
                >
                  {submitStatus.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        </section>
      </main>
    </>
  );
}
