import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ATTRIBUTES } from '../../lib/constants.js';

export function AttributeRadar({ attributes }) {
  const data = Object.entries(ATTRIBUTES).map(([key, meta]) => ({
    attribute: meta.label,
    level: attributes?.[key]?.level || 1,
    fullMark: 10,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgb(var(--c-arcane-500) / 0.25)" />
          <PolarAngleAxis dataKey="attribute" tick={{ fill: '#a29068', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
          <Radar
            name="Level"
            dataKey="level"
            stroke="rgb(var(--c-arcane-500))"
            fill="rgb(var(--c-arcane-500))"
            fillOpacity={0.26}
            strokeWidth={2}
            isAnimationActive
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}