import ProgressBarCustom from "./ProgressBar";

// Function to render average rating with progress bar and icon
const renderAverageRating = (
  label: string,
  value: number | null,
  icon: JSX.Element
) => {
  if (value === null || typeof value !== "number") {
    return (
      <p className="mb-1 d-flex align-items-center">
        <span className="me-2" style={{ fontSize: "1.5rem" }}>
          {icon}
        </span>
        <strong>{label}:</strong> --
      </p>
    );
  }

  return (
    <div className="mb-3 d-flex align-items-center">
      <div className="me-2" style={{ fontSize: "1.5rem" }}>
        {icon}
      </div>
      <div className="flex-grow-1">
        <strong>{label}:</strong>
        <ProgressBarCustom value={value} label={`${value}/10`} />
      </div>
    </div>
  );
};

export default renderAverageRating;
