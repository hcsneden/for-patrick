export function ChartCard({ title, children }) {
  return (
    <div className="chart-card">
      <h2>{title}</h2>
      <div className="chart-container">
        {children}
      </div>
    </div>
  );
}
