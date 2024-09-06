import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Это LocalStorage по умолчанию
import portfolioReducer from './slices/PortfolioSlice';

const persistConfig = {
  key: 'root', // Ключ для хранения в LocalStorage
  storage,     // Хранилище, в котором сохраняется состояние (LocalStorage)
  whitelist: ['portfolio'], // Список редьюсеров, которые нужно сохранять
};

const persistedReducer = persistReducer(persistConfig, portfolioReducer);

const store = configureStore({
  reducer: {
    portfolio: persistedReducer, // Подключаем persistReducer к store
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
