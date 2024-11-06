export const currencyFormat = (num) => {
  // Kiểm tra nếu num là số, nếu không thì đặt num là 0
  const value = typeof num === "number" ? num : parseFloat(num) || 0;
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
