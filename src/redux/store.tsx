import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import portfolioReducer from './slices/PortfolioSlice';

const persistConfig = {
  key: 'root', 
  storage,    
  whitelist: ['portfolio'], 
};

const persistedReducer = persistReducer(persistConfig, portfolioReducer);

const store = configureStore({
  reducer: {
    portfolio: persistedReducer, 
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;




