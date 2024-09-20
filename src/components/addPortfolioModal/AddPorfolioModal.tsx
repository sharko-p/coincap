import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToPortfolio, closeModal } from "../../redux/slices/PortfolioSlice";
import { ValueValidation } from "./Validation";

const AddToPortfolioModal: React.FC = () => {
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const dispatch = useAppDispatch();
  const { isModalVisible, selectedCrypto } = useAppSelector(
    (state) => state.portfolio
  );

  const handleOk = async () => {
    try {
      const validCryptoAmount = await ValueValidation.validate(cryptoAmount);

      if (selectedCrypto && validCryptoAmount) {
        const amountToAdd = parseFloat(validCryptoAmount);
        dispatch(
          addToPortfolio({ symbol: selectedCrypto, amount: amountToAdd })
        );
        message.success(
          `${validCryptoAmount} ${selectedCrypto} добавлено в ваш портфель`
        );
      }
      dispatch(closeModal());
      setCryptoAmount("");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        message.error(err.errors[0]);
      }
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
    setCryptoAmount("");
  };

  return (
    <Modal
      title="Добавить в инвестиционный портфель"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Введите количество {selectedCrypto} для покупки:</p>
      <Input
        value={cryptoAmount}
        onChange={(e) => setCryptoAmount(e.target.value)}
        placeholder="Введите количество"
      />
    </Modal>
  );
};

export default AddToPortfolioModal;
