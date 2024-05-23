import { BasicStockI, DetailedStockI } from "../Types";
import { useEffect, useState } from "react";

import ChartComponent from "./ChartComponent";
import { IoLogoBitcoin } from "react-icons/io";
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
  if (isPending || isLoading) return <div>Loading...</div>;

  if (status === "error") return <div>Error fetching data</div>;

  console.debug("detailedStock", detailedStock);

  return (
    <Container>
      <StockCard>
        <IoLogoBitcoin size={30} />
        <NameSymbol>
          <StyledSymbol>{detailedStock?.symbol}</StyledSymbol>
          <StyledKey>{detailedStock?.name}</StyledKey>
        </NameSymbol>
        <p>{detailedStock?.open}</p>
        <p>{detailedStock?.high}</p>
        <p>{detailedStock?.low}</p>
        <p>{detailedStock?.close}</p>
        <p>{detailedStock?.volumes}</p>
      </StockCard>
      <ChartComponent chartStocks={detailedStocks} />
      {/* <div>
        <StyledHeader>
          Last updated at: <StyledValue>{detailedStock?.timestamp}</StyledValue>
        </StyledHeader>
      </div> */}
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
  gap: 0.5rem;
  width: 100%;
  border: 1px solid red;
  padding: 0.5rem 0;
`;

const NameSymbol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledSymbol = styled.p``;

const StyledKey = styled.p`
  font-size: 0.75em;
`;

export default DetailedStock;
