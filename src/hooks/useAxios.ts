import axios from "axios";

export const fetchAllStocks = async () => {
  const res = await axios.get(
    "https://aij1hx90oj.execute-api.ap-southeast-2.amazonaws.com/prod/all",
    {
      headers: {
        "x-api-key": "1oeViSb1Ke71OdGDjnuVF2G8pYJbOmtb313DyxUL",
      },
    }
  );
  return res.data;
};

export const fetchStockByIndustry = async (industry: string) => {
  const res = await axios.get(
    `https://aij1hx90oj.execute-api.ap-southeast-2.amazonaws.com/prod/industry?industry=${industry}`,
    {
      headers: {
        "x-api-key": "1oeViSb1Ke71OdGDjnuVF2G8pYJbOmtb313DyxUL",
      },
    }
  );
  return res.data;
};
