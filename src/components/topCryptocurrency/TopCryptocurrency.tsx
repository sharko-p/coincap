import React, { useEffect, useState } from "react";
import axios from "axios";
import { Crypto, CryptoApiResponse } from "./types";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const TopCryptocurrency = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
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
