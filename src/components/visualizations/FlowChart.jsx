import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-dark/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-brand-gold font-bold text-lg">
          {payload[0].value} <span className="text-xs text-gray-500">m³/min</span>
        </p>
      </div>
    );
  }
  return null;
};

const FlowChart = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4A24E" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D4A24E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#D4A24E" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorFlow)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlowChart;
