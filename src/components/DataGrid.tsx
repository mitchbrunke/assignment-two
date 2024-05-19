import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { BasicStockI, DetailedStockI } from "../Types";
import { ColDef, ColGroupDef, GridApi } from "ag-grid-community";
import React, { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import Loader from "./Loader";

type Props = {
  stocks: BasicStockI[] | DetailedStockI[];
  onRowClick?: (stock: BasicStockI | DetailedStockI) => void;
};

type HeaderRowI = ColDef & {
  headerName: string;
  field: keyof BasicStockI | keyof DetailedStockI;
};

const DataGrid = ({ stocks, onRowClick }: Props) => {
  const [rowData, setRowData] = useState<BasicStockI[]>([]);
  const [columnDefs, setColumnDefs] = useState<HeaderRowI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (stocks.length > 0) {
      setLoading(true);
      const columns = Object.keys(stocks[0]).map((key) => ({
        headerName: key,
        field: key as keyof BasicStockI | keyof DetailedStockI,
      }));

      if ("timestamp" in stocks[0]) {
        columns.splice(0, 1);
      }
      setColumnDefs(columns);
      setRowData(stocks);
      setLoading(false);
    }
  }, [stocks]);

  let gridApi: GridApi | undefined;

  const onGridReady = (params: { api: GridApi }) => {
    gridApi = params.api;
  };

  useEffect(() => {
    if (loading) {
      gridApi?.showLoadingOverlay();
    } else {
      gridApi?.hideOverlay();
    }
  }, [gridApi, loading]);

  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500, width: "100%" }}
    >
      <AgGridReact
        columnDefs={
          columnDefs as (
            | ColDef<BasicStockI | DetailedStockI, unknown>
            | ColGroupDef<BasicStockI | DetailedStockI>
          )[]
        }
        rowData={rowData}
        onRowClicked={
          onRowClick
            ? (e) => {
                if (e.data) {
                  onRowClick(e.data);
                }
              }
            : undefined
        }
        onGridReady={onGridReady}
        loadingOverlayComponent={<Loader />}
        defaultColDef={{
          flex: 1,
          cellStyle: { textAlign: "left" },
        }}
      />
    </div>
  );
};

export default DataGrid;
