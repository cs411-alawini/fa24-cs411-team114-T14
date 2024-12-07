const formatCurrency = (
  value: number | null | undefined,
  currencyCode: string
): string => {
  if (typeof value !== "number") {
    return "--";
  }
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return "--";
  }
};

export default formatCurrency;
