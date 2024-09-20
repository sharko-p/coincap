  export const formatFixed = (value: string | number | null, digits = 2): string => {
    if (value === null || value === undefined) {
      return "Error while formatting"; 
    }
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "0.00";
    return num.toFixed(digits);
  };
  