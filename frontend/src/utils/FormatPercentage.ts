const formatPercentage = (
  value: number | null | undefined,
  defaultValue: string = "--"
): string => {
  if (typeof value !== "number") {
    return defaultValue;
  }
  try {
    return `${value.toFixed(2)}%`;
  } catch {
    return defaultValue;
  }
};

export default formatPercentage;
