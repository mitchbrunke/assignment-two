import React, { useEffect, useState } from "react";

import DataGrid from "./DataGrid";
import { DetailedStockI } from "../Types";
import Loader from "./Loader";
import { fetchStockByIndustry } from "../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  industryFilter: string;
  searchTerm: string;
};

const DetailedGrid = ({ industryFilter, searchTerm }: Props) => {
  const [detailedStocks, setDetailedStocks] = useState<DetailedStockI[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<DetailedStockI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, isPending, status } = useQuery({
    queryKey: ["allStocks", industryFilter],
    queryFn: () => fetchStockByIndustry(industryFilter),
    enabled: industryFilter !== "All",
  });

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      const newestItemsMap: Map<string, DetailedStockI> = new Map();
      data.forEach((item: DetailedStockI) => {
        const existingItem = newestItemsMap.get(item.name);
        if (!existingItem || item.timestamp > existingItem.timestamp) {
          newestItemsMap.set(item.name, item);
        }
      });

      const newestItems: DetailedStockI[] = Array.from(newestItemsMap.values());
      setDetailedStocks(newestItems);
      setFilteredStocks(newestItems);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm !== "" && detailedStocks.length > 0) {
      const filteredStocks = detailedStocks.filter((stock: DetailedStockI) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filteredStocks);
    }
  }, [searchTerm, detailedStocks]);

  if (industryFilter === "All") {
    return <div>Please select an industry</div>;
  }

  if (isPending || isLoading) return <Loader />;

  if (status === "error") return <div>Error fetching data</div>;

  return (
    <DataGrid
      stocks={filteredStocks}
      onRowClick={(e) => console.debug("clicked", e)}
    />
  );
};

export default DetailedGrid;
