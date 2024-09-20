import axios from "axios";
import {
  CryptoData,
  HistoricalData,
} from "../pages/CryptocurrencyDetails/types";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const fetchCryptoDetails = async (id: string): Promise<CryptoData> => {
  try {
    const response = await axios.get(`${API_URL}/assets/${id}`, {
      headers: {
        Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching crypto details:", error);
    throw error;
  }
};

export const fetchCryptoHistory = async (
  id: string,
  startTime: number,
  endTime: number
): Promise<HistoricalData[]> => {
  try {
    const response = await axios.get(`${API_URL}/assets/${id}/history`, {
      params: { interval: "d1", start: startTime, end: endTime },
      headers: {
        Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching crypto history:", error);
    throw error;
  }
};
