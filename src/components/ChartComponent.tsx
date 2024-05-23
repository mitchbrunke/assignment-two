import "chartjs-adapter-moment";

import {
  CategoryScale,
  ChartDataset,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useState } from "react";

import { DetailedStockI } from "../Types";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

type Props = {
  chartStocks: DetailedStockI[];
};

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ chartStocks }: Props) => {
  const [chartDatasets, setChartDatasets] = useState<string[]>([]);

  // sort the filtered data by timestamp
  chartStocks.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const chartData = {
    labels: chartStocks.map((stock) => new Date(stock.timestamp).toISOString()),
    datasets: [
      // {
      //   label: "Open",
      //   data: chartStocks.map((stock) => stock.open),
      //   fill: false,
      //   backgroundColor: "rgba(75,192,192,0.2)",
      //   borderColor: "rgba(75,192,192,1)",
      // },
      // {
      //   label: "Close",
      //   data: chartStocks.map((stock) => stock.close),
      //   fill: false,
      //   backgroundColor: "rgba(192,75,192,0.2)",
      //   borderColor: "rgba(192,75,192,1)",
      // },
      {
        label: "High",
        data: chartStocks.map((stock) => stock.high),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Low",
        data: chartStocks.map((stock) => stock.low),
        fill: false,
        backgroundColor: "rgba(192,75,192,0.2)",
        borderColor: "rgba(192,75,192,1)",
      },
    ],
  };

  return (
    <ChartContainer>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
            y: {
              type: "linear",
            },
          },
        }}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default ChartComponent;
