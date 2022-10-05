import { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export const PieStatChart = ({ data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width="100%" height="100%">
        <Legend align="center" verticalAlign="bottom" />
        <Pie
          data={data}
          dataKey="value"
          label={renderCustomizedLabel}
          labelLine={false}
        >
          <Cell key="scraped" fill="#F39887" />
          <Cell key="relevant" fill="#4C5976" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
