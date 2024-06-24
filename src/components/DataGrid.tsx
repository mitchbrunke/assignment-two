import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { BasicStockI, DetailedStockI } from "../Types";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  RowClickedEvent,
} from "ag-grid-community";
import { useEffect, useState } from "react";

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

const isBasicStock = (
  stock: BasicStockI | DetailedStockI
): stock is BasicStockI => {
  return "close" in stock;
};

const DataGrid = ({ stocks, onRowClick }: Props) => {
  const [rowData, setRowData] = useState<BasicStockI[] | DetailedStockI[]>([]);
  const [columnDefs, setColumnDefs] = useState<HeaderRowI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (stocks.length > 0) {
      setLoading(true);
      const columns = Object.keys(stocks[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key as keyof BasicStockI | keyof DetailedStockI,
      }));

      if ("timestamp" in stocks[0]) {
        columns.splice(1, 3);
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
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        columnDefs={
          columnDefs as (
            | ColDef<BasicStockI | DetailedStockI, unknown>
            | ColGroupDef<BasicStockI | DetailedStockI>
          )[]
        }
        rowData={rowData}
        onRowClicked={(
          event: RowClickedEvent<BasicStockI | DetailedStockI | undefined>
        ) => event.data && onRowClick?.(event.data)}
        onGridReady={onGridReady}
        loadingOverlayComponent={<Loader />}
        defaultColDef={{
          flex: 1,
          cellStyle: { textAlign: "left" },
        }}
        getRowStyle={(params) => {
          if (params.node.rowIndex !== null && params.node.rowIndex % 2 === 0) {
            return { background: "#f6f6f6" }; // change this to the color you want for every second row
          }
        }}
      />
    </div>
  );
};

export default DataGrid;
