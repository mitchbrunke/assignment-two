import "react-datepicker/dist/react-datepicker.css";

import { BasicStockI, DetailedStockI } from "../Types";
import {
  fetchStockBySymbol,
  fetchStockHistoryBySymbol,
} from "../hooks/useAxios";
import { useEffect, useState } from "react";

import { AiOutlineStock } from "react-icons/ai";
import ChartComponent from "./ChartComponent";
import DataGrid from "./DataGrid";
import DatePicker from "react-datepicker";
import Loader from "./Loader";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

type Props = {
  targetStock: BasicStockI;
};

const DetailedStock = ({ targetStock }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailedStocks, setDetailedStocks] = useState<DetailedStockI[]>([]);
  const [detailedStock, setDetailedStock] = useState<DetailedStockI | null>(
    null
  );
  const [tableData, setTableData] = useState<DetailedStockI[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { data, isPending, status } = useQuery({
    queryKey: ["allStocks", targetStock],
    queryFn: () => fetchStockHistoryBySymbol(targetStock.symbol),
  });

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      // Filter by symbol
      let filteredData = data.filter(
        (stock: DetailedStockI) => stock.symbol === targetStock.symbol
      );

      if (!startDate && !endDate) {
        setStartDate(new Date(filteredData[filteredData.length - 1].timestamp));
        setEndDate(new Date(filteredData[0].timestamp));
      }

      // Date range filtering
      // Combined date range filtering
      if (startDate && endDate) {
        filteredData = filteredData.filter((stock: DetailedStockI) => {
          const stockDate = new Date(stock.timestamp);
          return stockDate >= startDate && stockDate <= endDate;
        });
      }

      // Find the closest stock to the current date
      const closestStock = filteredData.reduce(
        (a: DetailedStockI, b: DetailedStockI) => {
          const now = new Date().getTime();
          const aDiff = Math.abs(new Date(a.timestamp).getTime() - now);
          const bDiff = Math.abs(new Date(b.timestamp).getTime() - now);
          return aDiff < bDiff ? a : b;
        },
        filteredData[0]
      ); // Default to the first item if reduce cannot execute

      setDetailedStock(closestStock);
      setDetailedStocks(filteredData);

      // Sorting for table display
      const filteredDataCopy = [...filteredData];
      filteredDataCopy.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTableData(filteredDataCopy);
      setIsLoading(false);
    }
  }, [data, targetStock.symbol, startDate, endDate]);

  if (isPending || isLoading)
    return (
      <Container>
        <Loader />
      </Container>
    );

  if (status === "error") return <div>Error fetching data</div>;

  return (
    <Container>
      <DatePicker
        selected={startDate}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        }}
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        maxDate={endDate}
        selectsRange
        selectsDisabledDaysInRange
        inline
      />
      {/* button to reset start and end dates */}
      <button
        onClick={() => {
          setStartDate(undefined);
          setEndDate(undefined);
        }}
      >
        Reset
      </button>
      <StockCard>
        <AiOutlineStock size={30} />
        <NameSymbol>
          <StyledSymbol>{detailedStock?.symbol}</StyledSymbol>
          <StyledKey
            isPositive={
              Number(detailedStock?.close) > Number(detailedStock?.open)
            }
          >
            {detailedStock?.name}
          </StyledKey>
        </NameSymbol>
        <NameSymbol>
          <StyledSymbol>Open</StyledSymbol>
          <StyledKey
            isPositive={
              Number(detailedStock?.close) > Number(detailedStock?.open)
            }
          >
            {detailedStock?.open}
          </StyledKey>
        </NameSymbol>

        <NameSymbol>
          <StyledSymbol>High</StyledSymbol>
          <StyledKey
            isPositive={
              Number(detailedStock?.high) > Number(detailedStock?.open)
            }
          >
            {detailedStock?.high}
          </StyledKey>
        </NameSymbol>

        <NameSymbol>
          <StyledSymbol>Low</StyledSymbol>
          <StyledKey
            isPositive={
              Number(detailedStock?.low) > Number(detailedStock?.open)
            }
          >
            {detailedStock?.low}
          </StyledKey>
        </NameSymbol>

        <NameSymbol>
          <StyledSymbol>Close</StyledSymbol>
          <StyledKey
            isPositive={
              Number(detailedStock?.close) > Number(detailedStock?.open)
            }
          >
            {detailedStock?.close}
          </StyledKey>
        </NameSymbol>

        <NameSymbol>
          <StyledSymbol>Volumes</StyledSymbol>
          <StyledKey
            isPositive={
              Number(detailedStock?.close) > Number(detailedStock?.open)
            }
          >
            {detailedStock?.volumes}
          </StyledKey>
        </NameSymbol>

        <NameSymbol>
          <StyledSymbol>Updated at:</StyledSymbol>
          <StyledDate>{detailedStock?.timestamp}</StyledDate>
        </NameSymbol>
      </StockCard>
      <DataGridContainer>
        <DataGrid
          stocks={tableData}
          onRowClick={(e) => {
            console.log(e);
          }}
        />
      </DataGridContainer>
      <ChartContainer>
        <ChartComponent chartStocks={detailedStocks} />
      </ChartContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 0.55rem;
`;

const StockCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  width: 100%;
  padding: 0.5rem 0;
`;

const DataGridContainer = styled.div`
  width: 100%;
  height: 25vh;
`;

const ChartContainer = styled.div`
  width: 100%;
`;

const NameSymbol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const StyledSymbol = styled.p`
  font-size: 0.9em;
`;

const StyledKey = styled.p<{ isPositive?: boolean }>`
  font-size: 0.75em;
  color: ${({ isPositive }) => (isPositive ? "#29bf12" : "#f21b3f")};
`;

const StyledDate = styled.p`
  font-size: 0.75em;
`;

export default DetailedStock;
