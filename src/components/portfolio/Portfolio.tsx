import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { ShoppingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Modal, Button } from 'antd';
import axios from "axios";
import { removeFromPortfolio } from '../../redux/slices/PortfolioSlice'; // Импортируем экшен для удаления

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const Portfolio = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector((state: RootState) => state.portfolio.cryptos);
  const [cryptoPrices, setCryptoPrices] = useState<{ [symbol: string]: number }>({});
  const [totalValue, setTotalValue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL not specified");
        }

        const response = await axios.get(`${API_URL}/assets`, {
          headers: {
            Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
            "Accept-Encoding": "gzip, deflate",
          },
        });

        const prices: { [symbol: string]: number } = {};
        response.data.data.forEach((crypto: { symbol: string, priceUsd: string }) => {
          prices[crypto.symbol] = parseFloat(crypto.priceUsd);
        });

        setCryptoPrices(prices);
      } catch (err) {
        console.error("Error fetching crypto prices:", err);
      }
    };

    fetchCryptoPrices();
  }, []);

  useEffect(() => {
    let total = 0;

    for (const symbol in portfolio) {
      const amount = portfolio[symbol];
      const price = cryptoPrices[symbol] || 0; // Цена криптовалюты
      total += amount * price; // Общая стоимость для данной криптовалюты
    }

    setTotalValue(total);
  }, [portfolio, cryptoPrices]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRemoveCrypto = (symbol: string) => {
    dispatch(removeFromPortfolio(symbol)); // Удаляем криптовалюту из портфеля
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ShoppingOutlined style={{ fontSize: "50px", color: "#08c", cursor: "pointer" }} onClick={showModal} />
        <div>
          <p>Итого: </p>
          <p>{totalValue.toFixed(2)} USD</p>
        </div>
      </div>

      <Modal
        title="Детали портфеля"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <p>Общая сумма портфеля: {totalValue.toFixed(2)} USD</p>
        <ul>
          {Object.keys(portfolio).map(symbol => (
            <li key={symbol}>
              {symbol}: {portfolio[symbol].toFixed(4)} ({(portfolio[symbol] * (cryptoPrices[symbol] || 0)).toFixed(2)} USD)
              <Button type="link" onClick={() => handleRemoveCrypto(symbol)}>Удалить</Button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default Portfolio;
