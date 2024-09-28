import React from 'react';

interface QuickLinkProps {
  name: string;
  icon: string;
}

const QuickLink: React.FC<QuickLinkProps> = ({ name, icon }) => (
  <button className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg p-4 m-1 w-24 h-24">
    <span className="text-2xl mb-2">{icon}</span>
    <span className="text-sm">{name}</span>
  </button>
);

const QuickLinksSection: React.FC = () => {
  const quickLinks: QuickLinkProps[] = [
    { name: 'FeelFlow', icon: '📊' },
    { name: 'Add Habit', icon: '➕' },
    { name: 'InsightSync', icon: '🔄' },
    { name: 'BreatheEase', icon: '🧘' },
    { name: 'Journals', icon: '📓' },
    { name: 'Insights & Tips', icon: '💡' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Quick Links</h2>
      <div className="flex flex-wrap justify-center">
        {quickLinks.map((link, index) => (
          <QuickLink key={index} {...link} />
        ))}
      </div>
    </div>
  );
};

export default QuickLinksSection;