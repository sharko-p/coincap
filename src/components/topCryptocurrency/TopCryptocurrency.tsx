import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

interface Crypto {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

interface CryptoApiResponse {
  data: Crypto[];
  timestamp: number;
}

const TopCryptocurrency = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        if (!API_URL) {
          throw new Error(
            "API_URL не указан. Пожалуйста, добавьте VITE_API_URL в ваш .env файл."
          );
        }

        const response = await axios.get<CryptoApiResponse>(
          `${API_URL}/assets`,
          {
            headers: {
              Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
            },
            params: {
              limit: 3,
            },
          }
        );

        setCryptos(response.data.data);
      } catch (err) {
        console.error("Error fetching cryptos:", err);
      }
    };

    fetchCryptos();
  }, []);
  return (
    <>
      <div>
        <p>Популярные криптовалюты:</p>
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {cryptos.map((crypto) => (
            <li
              key={crypto.id}
              style={{
                margin: "0 15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{crypto.name}</span>
              <span>${parseFloat(crypto.priceUsd).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TopCryptocurrency;
