export function Error({ message, onRetry }) {
  return (
    <div className="error">
      <h2>Unable to Load Data</h2>
      <p>{message}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
}
