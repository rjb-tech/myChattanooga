import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const BarGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width="100%"
        height="100%"
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: -30,
          bottom: 5,
        }}
      >
        <XAxis dataKey="publisher" tickLine={false} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Posted" fill="#F39887" />
        <Bar dataKey="Relevant" fill="#4C5976" />
      </BarChart>
    </ResponsiveContainer>
  );
};
