import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  cryptos: {
    [symbol: string]: number;
  };
  isModalVisible: boolean;
  selectedCrypto: string | null; 
}

const initialState: PortfolioState = {
  cryptos: {},
  isModalVisible: false,
  selectedCrypto: null,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addToPortfolio: (
      state,
      action: PayloadAction<{ symbol: string; amount: number }>
    ) => {
      const { symbol, amount } = action.payload;
      if (state.cryptos[symbol]) {
        state.cryptos[symbol] += amount;
      } else {
        state.cryptos[symbol] = amount;
      }
    },
    removeFromPortfolio: (state, action: PayloadAction<string>) => {
      const symbol = action.payload;
      delete state.cryptos[symbol];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.selectedCrypto = action.payload;
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
      state.selectedCrypto = null;
    },
  },
});

export const { addToPortfolio, removeFromPortfolio, openModal, closeModal } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
