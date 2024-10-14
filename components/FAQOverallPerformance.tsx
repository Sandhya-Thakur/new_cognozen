import React, { useState } from 'react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center bg-blue-50 p-4 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">{question}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQOverallPerformance: React.FC = () => {
  const faqs = [
    {
      question: "How can I track my progress on CognoZen?",
      answer: "CognoZen provides detailed progress insights and analytics that show your learning milestones, strengths, and areas for improvement. You can access these insights anytime to see how far you've come and where you need to focus via CognoZen's Analytics dashboard."
    },
    // Add more FAQs here
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Overall Performance</h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQOverallPerformance;