export interface Crypto {
    id: string;
    name: string;
    priceUsd: string;
  }
  
  export interface CryptoApiResponse {
    data: Crypto[];
    timestamp: number;
  }