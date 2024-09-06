import TopCryptocurrency from "../topCryptocurrency/TopCryptocurrency";
import Portfolio from "../portfolio/Portfolio";

const Header: React.FC = () => {
  return (
    <header style={{ display: "flex", justifyContent: "space-around"  }}>
      <TopCryptocurrency />
      <Portfolio />
    </header>
  );
};

export default Header;
