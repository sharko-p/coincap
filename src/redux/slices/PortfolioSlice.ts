import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  cryptos: {
    [symbol: string]: number;
  };
}

const initialState: PortfolioState = {
  cryptos: {},
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
  },
});

export const { addToPortfolio, removeFromPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
