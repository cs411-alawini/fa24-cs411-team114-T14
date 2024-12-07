// Color Mapping Function
const getRatingColor = (value: number): string => {
  if (value < 1) value = 1;
  if (value > 10) value = 10;

  let hue: number;

  if (value <= 5) {
    // From red (0°) to yellow (60°)
    hue = ((value - 1) / 4) * 60; // Maps 1-5 to 0-60
  } else {
    // From yellow (60°) to green (120°)
    hue = 60 + ((value - 6) / 4) * 60; // Maps 6-10 to 60-120
  }

  return `hsl(${hue}, 100%, 50%)`;
};

// Custom Progress Bar Component
const ProgressBarCustom: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => {
  const color = getRatingColor(value);

  return (
    <div
      style={{
        backgroundColor: "#e9ecef",
        borderRadius: "0.25rem",
        height: "1.5rem",
        marginTop: "0.5rem",
      }}
    >
      <div
        style={{
          width: `${value * 10}%`,
          backgroundColor: color,
          height: "100%",
          borderRadius: "0.25rem",
          textAlign: "center",
          color: "black",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default ProgressBarCustom;
