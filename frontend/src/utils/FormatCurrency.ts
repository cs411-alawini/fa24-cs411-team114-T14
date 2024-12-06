const formatCurrency = (
  value: number | null | undefined,
  currencyCode: string
): string => {
  if (typeof value !== "number") {
    return "--";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(value);
};

export default formatCurrency;
