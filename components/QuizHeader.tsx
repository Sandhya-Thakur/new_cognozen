import React from 'react';

type QuizHeaderProps = {
  title: string;
  description?: string;
};

const QuizHeader: React.FC<QuizHeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-2">{title}</h1>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
    </div>
  );
};

export default QuizHeader;