import { BasicStockI, DetailedStockI } from "../Types";
import { useEffect, useState } from "react";

import { AiOutlineStock } from "react-icons/ai";
import ChartComponent from "./ChartComponent";
import Loader from "./Loader";
import { fetchStockByIndustry } from "../hooks/useAxios";
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
  const { data, isPending, status } = useQuery({
    queryKey: ["allStocks", targetStock],
    queryFn: () => fetchStockByIndustry(targetStock.industry),
  });

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      const filteredData = data.filter(
        (stock: DetailedStockI) => stock.symbol === targetStock.symbol
      );
      setDetailedStock(
        filteredData.reduce((a: DetailedStockI, b: DetailedStockI) => {
          const now = new Date().getTime();
          const aDiff = Math.abs(new Date(a.timestamp).getTime() - now);
          const bDiff = Math.abs(new Date(b.timestamp).getTime() - now);

          return aDiff < bDiff ? a : b;
        })
      );
      setDetailedStocks(filteredData);
      setIsLoading(false);
    }
  }, [data, targetStock.symbol]);
  if (isPending || isLoading)
    return (
      <Container>
        <Loader />
      </Container>
    );

  if (status === "error") return <div>Error fetching data</div>;

  return (
    <Container>
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

      <ChartComponent chartStocks={detailedStocks} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
