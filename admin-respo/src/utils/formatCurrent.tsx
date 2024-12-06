const formatCurrency = (value: string | number): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(numericValue);
};

export default formatCurrency;
