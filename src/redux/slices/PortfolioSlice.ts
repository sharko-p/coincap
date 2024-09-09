import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioState {
  cryptos: {
    [symbol: string]: number; // Ключ — символ криптовалюты, значение — количество
  };
}

const initialState: PortfolioState = {
  cryptos: JSON.parse(localStorage.getItem('portfolio') || '{}'),
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addToPortfolio: (state, action: PayloadAction<{ symbol: string, amount: number }>) => {
      const { symbol, amount } = action.payload;
      if (state.cryptos[symbol]) {
        state.cryptos[symbol] += amount; // Если валюта уже есть, добавляем количество
      } else {
        state.cryptos[symbol] = amount; // Если это первая покупка данной валюты
      }
      localStorage.setItem('portfolio', JSON.stringify(state.cryptos));
    },
    removeFromPortfolio: (state, action: PayloadAction<string>) => {
      const symbol = action.payload;
      delete state.cryptos[symbol]; // Удаляем криптовалюту из объекта
      localStorage.setItem('portfolio', JSON.stringify(state.cryptos));
    },
  },
});

export const { addToPortfolio, removeFromPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;


