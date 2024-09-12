import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Input, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToPortfolio } from '../../redux/slices/PortfolioSlice';
import { RootState } from '../../redux/store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';



const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface CandleData {
  period: number;  // UNIX time in milliseconds
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

const CryptocurrencyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [historicalData, setHistoricalData] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки
  const dispatch = useDispatch();
const navigate= useNavigate()
  const portfolio = useSelector((state: RootState) => state.portfolio.cryptos);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(`${API_URL}/assets/${id}`, {
          headers: {
            Authorization: API_KEY ? `Bearer ${API_KEY}` : '',
            'Accept-Encoding': 'gzip, deflate',
          },
        });
        setCryptoData(response.data.data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        message.error('Не удалось загрузить данные о криптовалюте.');
      }
    };

    

    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(`${API_URL}/candles`, {
          params: {
            exchange: 'poloniex',
            interval: 'w1', 
            baseId: id,
            quoteId: 'bitcoin',
          },
          headers: {
            Authorization: API_KEY ? `Bearer ${API_KEY}` : '',
            'Accept-Encoding': 'gzip, deflate',
          },
        });
        console.log('Historical Data:', response.data.data); 
      } catch (error) {
        console.error('Error fetching historical data:', error);
        message.error('Не удалось загрузить исторические данные.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptoData();
    fetchHistoricalData();
  }, [id]);

  const handleAddToPortfolio = () => {
    const validAmount = parseFloat(cryptoAmount);
    if (isNaN(validAmount) || validAmount <= 0) {
      message.error('Введите корректное количество');
      return;
    }

    dispatch(addToPortfolio({ symbol: cryptoData.symbol, amount: validAmount }));
    message.success(`${validAmount} ${cryptoData.symbol} добавлено в ваш портфель`);
    setCryptoAmount('');
  };


  const transformHistoricalData = (data: CandleData[]) => {
    return data.map((item) => ({
      date: new Date(item.period).toLocaleDateString(), 
      close: parseFloat(item.close), 
    }));
  };

  if (!cryptoData) {
    return <div>Loading...</div>;
  }

  

  const handleClick=()=>{
      navigate(`/`); 
    };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>
        {cryptoData.name} ({cryptoData.symbol})
      </h2>
      <p>Цена: {parseFloat(cryptoData.priceUsd).toFixed(2)} USD</p>
      <p>Капитализация: {(parseFloat(cryptoData.marketCapUsd) / 1e9).toFixed(2)} млрд $</p>
      <p>Количество в портфеле: {portfolio[cryptoData.symbol] || 0}</p>

      <h3>Добавить в портфель</h3>
      <Input
        value={cryptoAmount}
        onChange={(e) => setCryptoAmount(e.target.value)}
        placeholder="Введите количество"
        style={{ width: '200px', marginRight: '10px' }}
      />
      <Button type="primary" onClick={handleAddToPortfolio}>
        Добавить
      </Button>

      <h3 style={{ marginTop: '40px' }}>График исторических данных</h3>
      {isLoading ? (
        <Spin tip="Загрузка графика..." />
      ) : historicalData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transformHistoricalData(historicalData)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Нет доступных исторических данных для отображения.</p>
      )}
<Button onClick={handleClick} >Вернуться к перечню криптовалют</Button>

    </div>
  );
};

export default CryptocurrencyDetails;


