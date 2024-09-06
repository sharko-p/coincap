import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioState {
  value: number;
}

const initialState: PortfolioState = {
  value: parseFloat(localStorage.getItem('portfolioValue') || '0'),
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addToPortfolio: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
      localStorage.setItem('portfolioValue', state.value.toString());
    },
  },
});

export const { addToPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
