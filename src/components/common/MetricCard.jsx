import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const MetricCard = ({ title, value, trend, trendValue, icon: Icon, color = 'emerald', sparklineData }) => {
  const isPositive = trend === 'up';
  const rawId = useId();
  const gradientId = `sparkGradient-${rawId.replace(/:/g, '')}`;
  const hasSparkline = Array.isArray(sparklineData) && sparklineData.length > 0;
  const chartData = hasSparkline ? sparklineData.map((v, i) => ({ i, value: v })) : null;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>

          <div className="flex items-center mt-2">
            <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {trendValue}
            </span>
            <span className="text-gray-500 text-xs ml-2">vs periodo anterior</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {hasSparkline && (
        <div className="relative z-10 mt-3 -mx-2 h-10 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A24E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#D4A24E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#D4A24E"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Decorative BG Icon */}
      <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors z-0" />
    </motion.div>
  );
};

export default MetricCard;
