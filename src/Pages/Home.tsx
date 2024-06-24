import { BasicStockI, DetailedStockI } from "../Types";
import { useEffect, useState } from "react";

import DataGrid from "../components/DataGrid";
import DetailedStock from "../components/DetailedStock";
import Loader from "../components/Loader";
import SearchComponent from "../components/Search";
import { fetchAllStocks } from "../hooks/useAxios";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [industries, setIndustries] = useState<string[]>([]);
  const [stocks, setStocks] = useState<BasicStockI[] | DetailedStockI[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<
    BasicStockI[] | DetailedStockI[]
  >([]);
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [targetStock, setTargetStock] = useState<BasicStockI | null>(null);

  const { data, status, isPending } = useQuery({
    queryKey: ["allStocks"],
    queryFn: fetchAllStocks,
  });

  useEffect(() => {
    if (data) {
      const uniqueIndustries: string[] = Array.from(
        new Set(data.map((stock: BasicStockI) => stock.industry))
      );
      uniqueIndustries.unshift("All");
      setIndustries(uniqueIndustries);
      setFilteredStocks(data);
      setStocks(data);
    }
  }, [data]);

  useEffect(() => {
    const filteredStocks = stocks.filter(
      (stock: BasicStockI) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (industryFilter === "All" || stock.industry === industryFilter)
    );
    setFilteredStocks(filteredStocks);
    setTargetStock(null);
  }, [searchTerm, industryFilter, stocks]);

  if (isPending) return <Loader />;
  if (status === "error") return <div>Error fetching data</div>;

  return (
    <PageWrapper>
      <SearchComponent
        industries={industries}
        setSearchTerm={setSearchTerm}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
      />

      <DataGrid
        stocks={filteredStocks}
        onRowClick={(e) => setTargetStock(e as DetailedStockI)}
      />

      {/* {targetStock ? (
        <DetailedStock targetStock={targetStock} />
      ) : (
        <EmptyState>Select Stock to see detailed view.</EmptyState>
      )} */}
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  background-color: #f0f0f0;
  color: #626262;
  margin-top: 1rem;
`;

export default Home;
