import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, InputNumber, message } from "antd";
import { useDispatch } from 'react-redux';
import { addToPortfolio } from '../../redux/slices/PortfolioSlice'; // Импортируем action
import type { TableColumnsType } from "antd";

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
  description?: string;
}

interface CryptoApiResponse {
  data: Crypto[];
  timestamp: number;
}

interface DataType {
  key: string;
  rank: string;
  symbol: string;
  name: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  priceUsd: string;
  description?: string;
}

const CryptocurrencyTable = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<number | null>(null);
  
  const dispatch = useDispatch(); // Для отправки action в store

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL not specified");
        }

        const response = await axios.get<CryptoApiResponse>(`${API_URL}/assets`, {
          headers: {
            Authorization: API_KEY ? `Bearer ${API_KEY}` : "",
            "Accept-Encoding": "gzip, deflate",
          },
        });

        setCryptos(response.data.data);

        const tableData = response.data.data.map((crypto) => {
          const inBillions = (parseFloat(crypto.marketCapUsd) / 1000000000).toFixed(2);
          return {
            key: String(crypto.id),
            rank: crypto.rank,
            symbol: crypto.symbol,
            name: crypto.name,
            vwap24Hr: `${parseFloat(crypto.vwap24Hr).toFixed(2)}$`,
            changePercent24Hr: `${parseFloat(crypto.changePercent24Hr).toFixed(2)}%`,
            marketCapUsd: `${inBillions} млрд $`,
            priceUsd: `${parseFloat(crypto.priceUsd).toFixed(2)}$`,
            description: crypto.description || "No description available",
          };
        });

        setTableData(tableData);
      } catch (err) {
        console.error("Error fetching cryptos:", err);
      }
    };

    fetchCryptos();
  }, []);

  const handleAddClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!cryptoAmount || cryptoAmount <= 0) {
      message.error("Введите положительное число");
      return;
    }
    if (selectedCrypto && cryptoAmount) {
      // Отправляем действие для добавления в портфель через Redux
      dispatch(addToPortfolio({ symbol: selectedCrypto.symbol, amount: cryptoAmount }));
      message.success(`${cryptoAmount} ${selectedCrypto.symbol} добавлено в ваш портфель`);
    }
    setIsModalVisible(false);
    setCryptoAmount(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCryptoAmount(null);
  };


  

  const columns: TableColumnsType<DataType> = [
    {
      title: "№",
      dataIndex: "rank",
      key: "rank",
      sorter: (a, b) => Number(a.rank) - Number(b.rank),
    },
    {
      title: "",
      dataIndex: "symbol",
      key: "symbol",
      render: (text) => <span style={{ color: "#8f1aa3", fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "VWAP (24Hr)",
      dataIndex: "vwap24Hr",
      key: "vwap24Hr",
      sorter: (a, b) => parseFloat(a.vwap24Hr) - parseFloat(b.vwap24Hr),
    },
    {
      title: "Change (24Hr)",
      dataIndex: "changePercent24Hr",
      key: "changePercent24Hr",
      sorter: (a, b) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr),
      render: (text) => {
        const change = parseFloat(text);
        const color = change < 0 ? "red" : "green";
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Market Cap",
      dataIndex: "marketCapUsd",
      key: "marketCapUsd",
    },
    {
      title: "Price",
      dataIndex: "priceUsd",
      key: "priceUsd",
      sorter: (a, b) => parseFloat(a.priceUsd) - parseFloat(b.priceUsd),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => handleAddClick(cryptos.find(c => c.id === record.key)!)}>
          +
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="key"
      />

      <Modal
        title="Добавить в инвестиционный портфель"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Введите количество {selectedCrypto?.symbol} для покупки:</p>
        <InputNumber
          min={0}
          step={0.0001}
          value={cryptoAmount}
          onChange={(value) => setCryptoAmount(value)}
        />
      </Modal>
    </>
  );
};

export default CryptocurrencyTable;
