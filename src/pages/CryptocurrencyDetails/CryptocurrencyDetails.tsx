import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { addToPortfolio } from "../../redux/slices/PortfolioSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatFixed } from "../../utils/helpers";
import {
  fetchCryptoDetails,
  fetchCryptoHistory,
} from "../../api/fetchCryptoHistory";
import { CryptoData, HistoricalData } from "./types";
import {Container} from './styleCryptovurrencyDetails'

const CryptocurrencyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const portfolio = useAppSelector(
    (state: RootState) => state.portfolio.cryptos
  );

  useEffect(() => {
    const fetchData = async () => {
      const endTime = new Date().getTime();
      const startTime = endTime - 7 * 24 * 60 * 60 * 1000;

      try {
        const [cryptoDetails, historyData] = await Promise.all([
          fetchCryptoDetails(id!),
          fetchCryptoHistory(id!, startTime, endTime),
        ]);

        setCryptoData(cryptoDetails);
        setHistoricalData(historyData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Не удалось загрузить данные о криптовалюте.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToPortfolio = () => {
    if (!cryptoData || !cryptoData.symbol) {
      message.error("Данные криптовалюты недоступны");
      return;
    }

    const validAmount = parseFloat(cryptoAmount);
    if (isNaN(validAmount) || validAmount <= 0) {
      message.error("Введите корректное количество");
      return;
    }

    dispatch(
      addToPortfolio({ symbol: cryptoData.symbol, amount: validAmount })
    );
    message.success(
      `${validAmount} ${cryptoData.symbol} добавлено в ваш портфель`
    );
    setCryptoAmount("");
  };

  const transformHistoricalData = (data: HistoricalData[]) => {
    return data.map((item) => ({
      date: new Date(item.time).toLocaleDateString(),
      Стоимость: parseFloat(item.priceUsd),
    }));
  };

  if (isLoading) {
    return <Spin tip="Загрузка данных..." size="large" />;
  }

  if (!cryptoData) {
    return <p>Не удалось загрузить данные о криптовалюте.</p>;
  }

  const transformedData = transformHistoricalData(historicalData);

  return (
    <div
      style={{ display: "flex", textAlign: "center", alignItems: "center", flexDirection: "column", }}
    >
      <Container>
      <h2>
        {cryptoData.name} ({cryptoData.symbol})
      </h2>
      <p>Текущая цена: {formatFixed(cryptoData.priceUsd)} USD</p>
      <p>
        Капитализация: {formatFixed(parseFloat(cryptoData.marketCapUsd) / 1e9)}
        млрд $
      </p>
      <p>Количество в портфеле: {portfolio[cryptoData.symbol] || 0}</p>
  
      <div>
        <h3>Добавить {cryptoData.name} в портфель</h3>
        <Input
          value={cryptoAmount}
          onChange={(e) => setCryptoAmount(e.target.value)}
          placeholder="Введите количество"
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={handleAddToPortfolio}>
          Добавить
        </Button>
    
      <h3 style={{ marginTop: "30px" }}>
        Изменение цены {cryptoData.name} за последнюю неделю
      </h3>
      </div>     </Container>
      {transformedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={transformedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Стоимость"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Нет доступных исторических данных для отображения.</p>
      )}

      <Button style={{marginTop:'15px'}} type="primary" onClick={() => navigate(`/`)}>
        Вернуться к перечню криптовалют
      </Button>
    </div>
  );
};

export default CryptocurrencyDetails;
