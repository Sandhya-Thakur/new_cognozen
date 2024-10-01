import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FeeFlowTrend: React.FC = () => {
  const percentage = 8.25;
  const angle = (percentage / 100) * 180; // Convert percentage to angle

  // Define constants for arc calculations
  const radiusX = 100; // X-radius
  const radiusY = 100; // Y-radius
  const centerX = 120; // Center X-coordinate
  const centerY = 120; // Center Y-coordinate

  // Calculate the endpoint of the arc
  const endX = centerX + Math.sin((angle * Math.PI) / 180) * radiusX;
  const endY = centerY - Math.cos((angle * Math.PI) / 180) * radiusY;

  // Data for the bar chart
  const data = [
    { name: 'Mon', value: 20 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 28 },
    { name: 'Thu', value: 80 },
    { name: 'Fri', value: 35 },
    { name: 'Sat', value: 65 },
    { name: 'Sun', value: 78 },
  ];

  return (
    <Card className="bg-white rounded-xl shadow-2xl overflow-hidden w-[280px] h-[400px] flex flex-col">
      <div className="w-[260px] h-[200px] ml-2 mt-2 relative">
        <svg
          viewBox="0 0 240 140"
          className="w-[240px] absolute top-1 left-1/2 transform -translate-x-1/2"
        >
          <defs>
            <linearGradient
              id="speedometerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#ADFF2F" />
              <stop offset="100%" stopColor="#90EE90" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d="M20 120 A 100 100 0 0 1 220 120"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="30"
            strokeLinecap="round"
          />
          {/* Gradient arc */}
          <path
            d={`M20 120 A ${radiusX} ${radiusY} 0 0 1 ${endX} ${endY}`}
            fill="none"
            stroke="url(#speedometerGradient)"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full pt-32">
          <h2 className="text-xl font-bold">Fee Flow</h2>
          <h2 className="text-xl font-bold mb-2">Trend</h2>
          <div className="mt-2 bg-[#E8F3DC] text-[#4CAF50] px-4 py-1 rounded-full inline-flex items-center">
            <ArrowUp size={16} />
            <span className="ml-1 font-semibold">8.25%</span>
          </div>
        </div>
      </div>
      <div className="w-[260px] h-[50px] ml-2 mt-19 relative flex justify-center items-center">
        <h4>Today's Check-ins</h4>
      </div>
      
      <div className="w-[260px] h-[130px] ml-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FeeFlowTrend;