// import Navigation from "./routes/navigation-component/Navigation";
import CryptocurrencyTable from "./cryptocurrencyTable/CryptocurrencyTable";
import Header from "./header/Header";
function App() {
  return (
    <div
      className="App"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 15px",
      }}
    >
      {/* <Navigation /> */}

      <Header />
      <CryptocurrencyTable/>
    </div>
  );
}

export default App;
