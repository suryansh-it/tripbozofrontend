'use client';

import React from 'react';
import { FaMapMarkedAlt, FaThList, FaPlaneDeparture } from 'react-icons/fa';

const steps = [
  {
    title: 'Pick a Destination',
    description: "Choose a country you're traveling to and unlock local travel apps.",
    icon: <FaMapMarkedAlt className="text-teal-500 text-4xl mb-4" />,
  },
  {
    title: 'Explore App Bundles',
    description: 'Find curated apps tailored for navigation, communication, and safety.',
    icon: <FaThList className="text-teal-500 text-4xl mb-4" />,
  },
  {
    title: 'Travel Smarter',
    description: 'Access essential tools and explore confidently wherever you go.',
    icon: <FaPlaneDeparture className="text-teal-500 text-4xl mb-4" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          How Trip Bozo Works
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-12">
          Your companion for discovering essential travel applications
        </p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mb-4">
                  {index + 1}
                </div>
                {step.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;