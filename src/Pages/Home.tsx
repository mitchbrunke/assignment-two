import * as Tabs from "@radix-ui/react-tabs";

import { BasicStockI, DetailedStockI } from "../Types";
import React, { useEffect, useState } from "react";

import DataGrid from "../components/DataGrid";
import DetailedGrid from "../components/DetailedGrid";
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
  }, [searchTerm, industryFilter, stocks]);

  if (isPending) return <Loader />;
  if (status === "error") return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Stocks</h1>
      <SearchComponent
        industries={industries}
        setSearchTerm={setSearchTerm}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
      />

      {/* create radix tabs to flip between basic and detailed view */}
      <TabsRoot defaultValue="basic">
        <TabsList aria-label="Select Detailed or Basic views.">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger className="detailed" value="detailed">
            Detailed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <DataGrid stocks={filteredStocks} />
        </TabsContent>
        <TabsContent value="detailed">
          <DetailedGrid
            industryFilter={industryFilter}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </TabsRoot>
    </div>
  );
};

const TabsRoot = styled(Tabs.Root)`
  display: flex;
  flex-direction: column;
  width: 65vw;
  box-shadow: 0 2px 10px var(--black-a4);
  margin: 1rem 0;
`;

const TabsList = styled(Tabs.List)`
  flex-shrink: 0;
  display: flex;
  border-bottom: 1px solid var(--mauve-6);
  width: 50%;
  padding: 0.5rem 0;
`;

const TabsTrigger = styled(Tabs.Trigger)`
  font-family: inherit;
  background-color: white;
  padding: 0 20px;
  height: 45px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
  color: var(--mauve-11);
  user-select: none;

  &[data-state="active"] {
    color: var(--violet-11);
    box-shadow: inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor;
  }

  &:focus {
    position: relative;
    box-shadow: 0 0 0 2px black;
  }

  &:hover {
    color: var(--violet-11);
  }
`;

const TabsContent = styled(Tabs.Content)`
  flex-grow: 1;
  padding: 20px;
  background-color: white;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px black;
  }
`;

export default Home;
