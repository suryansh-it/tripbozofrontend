'use client';

import React from 'react';
import { FaCheckCircle, FaUsers, FaSyncAlt, FaShieldAlt } from 'react-icons/fa';

const criteria = [
  {
    title: 'Useful in that country',
    description: 'We focus on apps that solve real travel needs in the destination, instead of generic tools that may not be helpful once you arrive.',
    icon: <FaCheckCircle className="text-indigo-600 text-3xl mb-4" />,
  },
  {
    title: 'Traveler-verified',
    description: 'We pay attention to real traveler feedback and usage signals from across the web so the picks reflect what people actually rely on during trips.',
    icon: <FaUsers className="text-indigo-600 text-3xl mb-4" />,
  },
  {
    title: 'Recently maintained',
    description: 'We prefer apps that are actively maintained and less likely to break, become outdated, or stop working when travelers need them most.',
    icon: <FaSyncAlt className="text-indigo-600 text-3xl mb-4" />,
  },
  {
    title: 'Privacy-aware',
    description: 'We also look for apps that feel trustworthy, practical, and not overly invasive, because travelers need confidence as well as convenience.',
    icon: <FaShieldAlt className="text-indigo-600 text-3xl mb-4" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          How We Select Apps
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-12">
          The picks on tripbozo are chosen using practical criteria, real traveler feedback, and destination relevance.
        </p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4">
          {criteria.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base text-center leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 sm:p-6 shadow-sm text-left">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-indigo-950">What this means in practice</h3>
              <p className="mt-1 text-sm sm:text-base text-indigo-800 leading-relaxed">
                We highlight apps that are useful in the destination, rated well by travelers, actively maintained, privacy-conscious, and relevant to the travel problems people actually face.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm font-semibold">
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">4.0+ rating</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">Recent updates</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">Local relevance</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">Privacy aware</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;