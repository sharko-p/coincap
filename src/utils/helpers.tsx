export const formatFixed = (value: string | number, digits = 2): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "0.00"; 
    return num.toFixed(digits);
  };