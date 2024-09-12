import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "../components/header/Header";
import CryptocurrencyTable from "../components/cryptocurrencyTable/CryptocurrencyTable";
import CryptocurrencyDetails from "../pages/CryptocurrencyDetails/CryptocurrencyDetails";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header /> 
        <CryptocurrencyTable /> 
      </>
    ),
  },
  {
    path: '/CryptocurrencyDetails/:id',
    element: <CryptocurrencyDetails />, 
  },
]);

export const AppRouter = () => {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div>
          <span>Loading....</span>
        </div>
      }
    />
  );
};
