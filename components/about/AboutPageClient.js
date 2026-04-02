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
          description: "Trip Bozo curates the perfect app bundle for every traveler's needs.",
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
            tripbozo curates the perfect app bundle for every traveler&apos;s needs, no matter where your journey takes you.
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
                We believe that <span className="text-teal-600 font-semibold">technology should enhance your travel experience</span>, not complicate it. Our mission is to help travelers discover the essential digital tools they need for each unique destination, creating a more connected, prepared, and enriching journey.
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
        <section className="w-full py-16 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 text-center mb-8 sm:mb-16">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
                Key Features
              </span>
            </h2>
            {/* Feature Items */}
            {[

              { icon: '📱', title: 'Curated App Collections', text: 'Expert-vetted selections of the best travel apps for every destination, organized by category. Save time researching and focus on enjoying your trip.', align: 'left', bg: 'bg-cyan-100' },
              { icon: '🚨', title: 'Comprehensive Travel Essentials', text: 'Access offline emergency contacts, key local phrases, safety tips, and essential services—all curated for your destination', align: 'right', bg: 'bg-yellow-100' },
              { icon: '🏔️', title: 'Dynamic Leg Suggestions', text: 'Receive app recommendations based on the type of stop in your journey, from beach destinations to mountain retreats. Our AI-powered system learns your preferences to suggest exactly what you need.', align: 'left', bg: 'bg-blue-100' },
              { icon: '🧑‍💼', title: 'Personalized Onboarding', text: 'Tell us about your travel style and destinations to get the most relevant app suggestions for your journey. We tailor recommendations based on your unique preferences.', align: 'right', bg: 'bg-teal-100' },
              
            ].map((feat, i) => (
              <div key={i} className={`mb-16 sm:mb-24 flex flex-col ${feat.align==='right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
                <div className="md:w-1/3 flex justify-center">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${feat.bg} flex items-center justify-center shadow-lg`}>
                    <span className="text-5xl md:text-6xl">{feat.icon}</span>
                  </div>
                </div>
                <div className={`md:w-2/3 text-center ${feat.align==='right' ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{feat.title}</h3>
                  <p className="text-lg text-gray-600">{feat.text}</p>
                </div>
              </div>
            ))}
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
