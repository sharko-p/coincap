import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { openModal } from "../../redux/slices/PortfolioSlice";
import { Crypto, DataType } from "./types";
import AddToPortfolioModal from "../addPortfolioModal/AddPorfolioModal";
import type { ColumnsType } from "antd/es/table";
import { formatFixed } from "../../utils/helpers";
import { fetchAllCryptos } from "../../api/fetchAllCryptos";

const CryptocurrencyTable: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllCryptos();
        setCryptos(data);

        const formattedData = data.map((crypto) => {
          const marketCapUsd = crypto.marketCapUsd
            ? parseFloat(crypto.marketCapUsd)
            : 0;
          const inBillions = formatFixed(marketCapUsd / 1000000000);

          return {
            key: String(crypto.id),
            rank: crypto.rank,
            symbol: crypto.symbol,
            name: crypto.name,
            vwap24Hr: crypto.vwap24Hr
              ? `${formatFixed(crypto.vwap24Hr)}$`
              : "No description available",
            changePercent24Hr: crypto.changePercent24Hr
              ? `${formatFixed(crypto.changePercent24Hr)}%`
              : "N/A",
            marketCapUsd: `${inBillions} млрд $`,
            priceUsd: crypto.priceUsd
              ? `${formatFixed(crypto.priceUsd)}$`
              : "No description available",
            description: crypto.description || "No description available",
          };
        });

        setTableData(formattedData);
      } catch (err) {
        console.error("Error fetching cryptos:", err);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (cryptoId: string) => {
    navigate(`CryptocurrencyDetails/${cryptoId}`);
  };

  const handleAddClick = (crypto: Crypto, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal(crypto.symbol));
  };

  const columns: ColumnsType<DataType> = [
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
      render: (text) => (
        <span style={{ color: "#8f1aa3", fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => handleRowClick(record.key)}
        >
          {text}
        </span>
      ),
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
      sorter: (a, b) =>
        parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr),
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
      render: (_, record) => {
        const crypto = cryptos.find((c) => c.id === record.key);
        return (
          <Button onClick={(e) => crypto && handleAddClick(crypto, e)}>
            +
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="key"
        onRow={(record) => ({
          onClick: () => handleRowClick(record.key),
        })}
      />

      <AddToPortfolioModal />
    </>
  );
};

export default CryptocurrencyTable;
