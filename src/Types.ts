export interface BasicStockI {
  symbol: string;
  name: string;
  industry: string;
}

export interface DetailedStockI {
  timestamp: string;
  symbol: string;
  name: string;
  industry: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volumes: string;
}
