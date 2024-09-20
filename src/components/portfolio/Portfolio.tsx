import { RootState } from "../../redux/store";
import { ShoppingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import { removeFromPortfolio } from "../../redux/slices/PortfolioSlice";
import { formatFixed } from "../../utils/helpers";
import { fetchAllCryptos } from "../../api/fetchAllCryptos";  
import { useAppDispatch, useAppSelector } from "../../redux/hooks";  


const Portfolio = () => {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state: RootState) => state.portfolio.cryptos);
  const [cryptoPrices, setCryptoPrices] = useState<{ [symbol: string]: number }>({});
  const [totalValue, setTotalValue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const cryptos = await fetchAllCryptos(); 
        const prices: { [symbol: string]: number } = {};
        cryptos.forEach((crypto) => {
          prices[crypto.symbol] = parseFloat(crypto.priceUsd);
        });
        setCryptoPrices(prices);
      } catch (err) {
        console.error("Error fetching crypto prices:", err);
        message.error("Не удалось загрузить цены криптовалют");
      }
    };

    fetchCryptoPrices();
  }, []);

  useEffect(() => {
    let total = 0;

    Object.keys(portfolio).forEach((symbol) => {
      const amount = portfolio[symbol];
      const price = cryptoPrices[symbol] || 0;
      total += amount * price;
    });

    setTotalValue(total);
  }, [portfolio, cryptoPrices]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRemoveCrypto = (symbol: string) => {
    dispatch(removeFromPortfolio(symbol));
    message.success(`${symbol} был удален из портфеля`);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ShoppingOutlined
          style={{ fontSize: "50px", color: "#08c", cursor: "pointer" }}
          onClick={showModal}
        />
        <div>
          <p>Итого: </p>
          <p>{formatFixed(totalValue)} USD</p>
        </div>
      </div>

      <Modal
        title="Детали портфеля"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <p>Общая сумма портфеля: {formatFixed(totalValue)} USD</p>
        <ul>
          {Object.keys(portfolio).map((symbol) => (
            <li key={symbol}>
              {symbol}: {portfolio[symbol].toFixed(4)} (
              {formatFixed(portfolio[symbol] * (cryptoPrices[symbol] || 0))} USD)
              <Button type="link" onClick={() => handleRemoveCrypto(symbol)}>
                Удалить
              </Button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default Portfolio;
