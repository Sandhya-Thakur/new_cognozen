import React from 'react';
import Image from 'next/image';

const QandA: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Q&A Search</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="mo... [user typing]"
            className="w-full p-2 pr-10 border rounded-lg"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Share Your Valuable Feedback with Us</h2>
        <p className="text-sm text-gray-600">
          We thrive on your feedback! If you have questions that are not covered here or suggestions on how we can improve, please let us know. Your insights are invaluable in helping us enhance our FAQ section and ensure it meets your needs.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Need More Help? Get in Touch!</h2>
        <p className="text-sm text-gray-600 mb-4">
          Can not find the answer you are looking for? Reach out to us directly through the contact form on our website. We are here to help you every step of the way and ensure your experience with CognoZen is nothing short of excellent.
        </p>
        <p className="text-sm font-medium">Website: cognozen.ai</p>
        <div className="flex space-x-3 mt-4">
          <SocialIcon imagePath="/linkedin.png" alt="LinkedIn" />
          <SocialIcon imagePath="/github.png" alt="GitHub" />
          <SocialIcon imagePath="/w.png" alt="Website" />
        </div>
      </div>
    </div>
  );
};

const SocialIcon: React.FC<{ imagePath: string; alt: string }> = ({ imagePath, alt }) => (
  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
    <Image src={imagePath} alt={alt} width={24} height={24} />
  </div>
);

export default QandA;