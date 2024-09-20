import axios from "axios";
import { CryptoApiResponse } from "../components/cryptocurrencyTable/types";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const fetchAllCryptos = async () => {
  try {
    const response = await axios.get<CryptoApiResponse>(`${API_URL}/assets`, {
      headers: {
        Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cryptos:", error);
    throw error;
  }
};


