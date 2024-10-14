import React from 'react';

const FAQTopComponent: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <p className="text-sm text-gray-500">{formattedDate}</p>
        <h1 className="text-xl font-bold mt-2">FAQ</h1>
      </div>
    </div>
  );
};

export default FAQTopComponent;