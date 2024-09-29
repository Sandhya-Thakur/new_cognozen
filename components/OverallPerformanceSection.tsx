import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value1: 20, value2: 30, value3: 10 },
  { name: 'Feb', value1: 30, value2: 40, value3: 20 },
  { name: 'Mar', value1: 40, value2: 45, value3: 25 },
  { name: 'Apr', value1: 50, value2: 55, value3: 35 },
  { name: 'May', value1: 60, value2: 90, value3: 60 },
  { name: 'Jun', value1: 70, value2: 80, value3: 55 },
  { name: 'Jul', value1: 60, value2: 70, value3: 50 },
  { name: 'Aug', value1: 50, value2: 60, value3: 45 },
  { name: 'Sep', value1: 40, value2: 50, value3: 40 },
  { name: 'Oct', value1: 30, value2: 40, value3: 35 },
  { name: 'Nov', value1: 40, value2: 45, value3: 30 },
  { name: 'Dec', value1: 30, value2: 35, value3: 25 },
];

const OverallPerformanceSection: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 w-full  max-w-[1512px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Overall Performance</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm">12 months</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium shadow-sm">30 days</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium shadow-sm">7 days</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium shadow-sm">24 hours</button>
        </div>
      </div>
      <div className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorValue3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip />
            <Area type="monotone" dataKey="value1" stackId="1" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue1)" />
            <Area type="monotone" dataKey="value2" stackId="1" stroke="#82ca9d" fillOpacity={1} fill="url(#colorValue2)" />
            <Area type="monotone" dataKey="value3" stackId="1" stroke="#ffc658" fillOpacity={1} fill="url(#colorValue3)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          Great Job!
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-4">
        <span className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
          Live Data
        </span>
        <span className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
          Selected Duration
        </span>
      </div>
    </div>
  );
};

export default OverallPerformanceSection;