import * as yup from "yup";

const ValueValidation = yup
  .string()
  .matches(/^\d+([.,]?\d+)?$/, "Введён недопустимый символ")
  .transform((value) => {
    if (value) {
      return value.replace(",", ".");
    }
    return "";
  })
  .test("is-valid-number", "Введите корректное число", (value) => {
    return value !== undefined && !isNaN(parseFloat(value));
  });

export { ValueValidation };
