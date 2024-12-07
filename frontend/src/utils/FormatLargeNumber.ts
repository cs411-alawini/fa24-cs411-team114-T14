const formatLargeNumber = (value: number | null | undefined): string => {
  if (typeof value !== "number") {
    return "--";
  }
  try {
    if (value >= 1.0e12) {
      return (value / 1.0e12).toFixed(2) + "T";
    }
    if (value >= 1.0e9) {
      return (value / 1.0e9).toFixed(2) + "B";
    }
    if (value >= 1.0e6) {
      return (value / 1.0e6).toFixed(2) + "M";
    }
    if (value >= 1.0e3) {
      return (value / 1.0e3).toFixed(2) + "K";
    }
    return value.toString();
  } catch {
    return "--";
  }
};

export default formatLargeNumber;
