import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
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
        <Bar dataKey="scraped" fill="#D48193" />
        <Bar dataKey="relevant" fill="#005C6D" />
      </BarChart>
    </ResponsiveContainer>
  );
};
