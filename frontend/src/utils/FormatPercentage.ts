const formatPercentage = (
  value: number | null | undefined,
  defaultValue: string = "--"
): string => {
  if (typeof value !== "number") {
    return defaultValue;
  }
  return `${value.toFixed(2)}%`;
};

export default formatPercentage;
