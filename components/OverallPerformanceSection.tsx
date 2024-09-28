import React from 'react';

const OverallPerformanceSection: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Overall Performance</h2>
      <div className="flex space-x-4 mb-4">
        <button className="px-3 py-1 bg-blue-500 text-white rounded-full">12 months</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">30 days</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">7 days</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">24 hours</button>
      </div>
      <div className="h-64 bg-gray-200 flex items-center justify-center">
        <p>Performance Chart Placeholder</p>
      </div>
      <div className="flex justify-end mt-2">
        <span className="mr-4 text-sm"><span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Live Data</span>
        <span className="text-sm"><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Selected Duration</span>
      </div>
    </div>
  );
};

export default OverallPerformanceSection;