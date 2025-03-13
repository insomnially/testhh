import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PortfolioChart: React.FC = () => {
  const assets = useSelector((state: RootState) => state.portfolio.assets);

  const data = assets.map((asset, index) => ({
    name: asset.name,
    value: asset.quantity,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie data={data} dataKey="value" outerRadius={100}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PortfolioChart;
