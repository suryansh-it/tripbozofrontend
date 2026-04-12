"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLoader } from '@/components/LoaderContext';
import Script from 'next/script';

export default function AboutPageClient() {
  const { setShow } = useLoader();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleStartNow = () => {
    setShow(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to backend/email
    console.log("Feedback submitted:", form);
    setSubmitted(true);
  };

  const splitFeatureText = (text) => {
    const idx = text.indexOf('. ');
    if (idx === -1) return { lead: text, rest: '' };
    return {
      lead: text.slice(0, idx + 1),
      rest: text.slice(idx + 2),
    };
  };

  return (
    <>
      {/* JSON‑LD */}
      <Script id="about-schema" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Trip Bozo",
          url: "https://tripbozo.com",
          logo: "https://tripbozo.com/logo.png",
          description: "tripbozo helps travelers discover destination-specific app bundles, practical Essentials guidance, and helpful travel tools that make each trip easier to plan and safer to enjoy.",
          sameAs: [
            "https://twitter.com/tripbozo",
            "https://facebook.com/tripbozo",
            "https://instagram.com/tripbozo"
          ],
          contactPoint: {
            "@type": "ContactPoint",
            email: "support@tripbozo.com",
            contactType: "customer service"
          }
        })
      }} />

      <main className="bg-gradient-to-br from-[#e0f7fa] via-[#f5fafd] to-[#e3f2fd] text-gray-800 w-full min-h-screen">
        {/* Hero */}
        <section className="w-full bg-gradient-to-r from-[#38bdf8] via-[#2ad2c9] to-[#5eead4] text-white py-16 sm:py-24 px-4 sm:px-8 text-center relative overflow-hidden">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight animate-fade-in-up relative z-10">
            Your Essential<br className="hidden sm:block" /> Travel Companion
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto mb-8 text-white/90 font-medium drop-shadow animate-fade-in-up delay-200 relative z-10">
            tripbozo curates destination-ready app bundles, practical Essentials, and country-specific guidance so you can spend less time searching and more time traveling.
          </p>
        </section>

        {/* Mission */}
        <section className="w-[85%] sm:w-[90%] mx-auto -mt-8 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Text */}
            <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that <span className="text-teal-600 font-semibold">technology should make travel feel easier, clearer, and more confident</span>, not add extra friction. Our mission is to help travelers find the right digital tools for the right destination, with recommendations that save time, reduce guesswork, and support better decisions before and during a trip.
              </p>
              {/* <Link
                href="/"
                onClick={handleStartNow}
                className="self-start inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md"
              >
                Start Exploring
              </Link> */}
            </div>
            {/* Icon */}
            <div className="md:w-1/3 bg-gradient-to-br from-teal-50 to-blue-50 p-8 flex items-center justify-center">
              <span className="text-7xl">🌍</span>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="w-full py-24 sm:py-28 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 text-center mb-12 sm:mb-20">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
                Key Features
              </span>
            </h2>
            {/* Feature Items */}
            {[
              { icon: '📱', title: 'Curated App Collections', text: 'See the best travel apps for each destination in one place, with direct install links, alternatives, and ratings. It cuts out the noise and helps travelers choose faster for navigation, rides, payments, translation, and local discovery. You spend less time comparing random apps and more time preparing a bundle that actually fits your trip style.', align: 'left', bg: 'bg-cyan-100' },
              { icon: '🚨', title: 'Comprehensive Travel Essentials', text: 'Find emergency contacts, embassy help, phrases, transit basics, payment tips, scam warnings, and offline-ready guidance. Everything important is grouped into one easy reference, so travelers can act quickly before and during a trip. Instead of searching multiple sites in a stressful moment, the core information is already organized and ready to use.', align: 'right', bg: 'bg-yellow-100' },
              { icon: '🗺️', title: 'Country Travel Guide', text: 'Open a destination guide that connects app picks with local travel reality. It shows what matters most for that country, from transport and safety to connectivity and money habits, so the suggestions feel practical instead of generic. This helps users understand not just what to install, but why each recommendation is useful in that specific place.', align: 'left', bg: 'bg-blue-100' },
              { icon: '🧭', title: 'Personalized Onboarding', text: 'A short intro explains how tripbozo works and lets you save your origin country. That makes the guidance feel more relevant from the first visit, with better support and less guesswork. The setup stays lightweight, but still gives enough context to personalize Essentials and improve the quality of recommendations.', align: 'right', bg: 'bg-teal-100' },
              
            ].map((feat, i) => {
              const parts = splitFeatureText(feat.text);
              return (
              <div key={i} className={`group mb-24 sm:mb-28 flex flex-col ${feat.align==='right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 sm:gap-14`}>
                <div className="md:w-1/3 flex justify-center">
                  <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl ${feat.bg} flex items-center justify-center shadow-lg overflow-hidden group-hover:shadow-2xl transition-all duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                    <span className="relative text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">{feat.icon}</span>
                  </div>
                </div>
                <div className={`md:w-[68%] text-center ${feat.align==='right' ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-2xl sm:text-[2rem] font-extrabold tracking-tight text-slate-900 mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent group-hover:from-cyan-700 group-hover:to-blue-700 transition-all duration-300">
                      {feat.title}
                    </span>
                  </h3>
                  <div className={`mb-4 sm:mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 ${feat.align==='right' ? 'ml-auto' : 'mr-auto'} opacity-80 group-hover:w-28 transition-all duration-300`} />
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
            )})}
          </div>
        </section>

        {/* Stats */}
        <section className="w-full py-12 bg-gradient-to-r from-[#2ad2c9]/10 via-[#38bdf8]/10 to-[#5eead4]/10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: '25+', label: 'Countries Covered' },
                { num: '300+', label: 'Curated Apps' },
                { num: '1k+', label: 'Happy Travelers' },
                { num: '4.5',  label: 'Average Rating' },
              ].map((stat,i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-bold text-teal-500 mb-2">{stat.num}</span>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

         {/* Feedback Form */}
         <section className="w-full bg-gradient-to-r from-[#2ad2c9] via-[#38bdf8] to-[#5eead4] text-white py-16 px-4 sm:px-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
              We’d Love Your Feedback
            </h2>

            <form
              action="https://formsubmit.co/bozotrip@gmail.com"
              method="POST"
              className="grid gap-4 sm:grid-cols-2 bg-white p-8 rounded-2xl shadow-lg text-gray-800"
            >
              {/* Disable the built‑in captcha */}
              <input type="hidden" name="_captcha" value="false" />

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="col-span-2 sm:col-span-1 px-4 py-2 rounded-lg border focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="col-span-2 sm:col-span-1 px-4 py-2 rounded-lg border focus:outline-none"
              />
              <textarea
                name="message"
                placeholder="Your Feedback…"
                rows={4}
                required
                className="col-span-2 px-4 py-2 rounded-lg border focus:outline-none"
              />

              <button
                type="submit"
                className="col-span-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-full transition shadow-md"
              >
                Send Feedback
              </button>
            </form>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
        </section>
      </main>
    </>
  );
}
