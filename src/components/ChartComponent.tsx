import "chartjs-adapter-moment";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";

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
  // sort the filtered data by timestamp
  chartStocks.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const chartData = {
    labels: chartStocks.map((stock) => new Date(stock.timestamp).toISOString()),
    datasets: [
      {
        label: "Close",
        data: chartStocks.map((stock) => stock.close),
        fill: false,
        backgroundColor: "#9a5de52f",
        borderColor: "#9b5de5",
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
                displayFormats: {
                  day: "MMM D",
                },
              },
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              type: "linear",
              position: "left",
              title: {
                display: true,
                text: "Price",
              },
              ticks: {
                callback: function (tickValue: string | number) {
                  if (typeof tickValue === "number") {
                    return `$${tickValue}`;
                  }
                  return tickValue;
                },
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
        }}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 25vh;
  margin-top: 1rem;
`;

export default ChartComponent;
