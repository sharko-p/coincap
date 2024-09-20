export type Crypto = {
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
};

export type CryptoApiResponse = {
  data: Crypto[];
  timestamp: number;
};

export type DataType = {
  key: string;
  rank: string;
  symbol: string;
  name: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  priceUsd: string;
  description?: string;
};
