import { useDispatch, useSelector } from "react-redux";
import { addToPortfolio } from "../../redux/slices/PortfolioSlice";
import { RootState } from "../../redux/store";
import { ShoppingOutlined } from "@ant-design/icons";

const Portfolio = () => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.portfolio.value);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ShoppingOutlined style={{ fontSize: "50px", color: "#08c" }} />
        <div >
        <p>Итого: </p>
        <p>{value.toFixed(2)} USD</p></div>
        <button onClick={() => dispatch(addToPortfolio(10.5))}>Добавить $10.50</button>
      <button onClick={() => dispatch(addToPortfolio(-25.3))}>Убавить $25.30</button>
      </div>{" "}
    </>
  );
};

export default Portfolio;
