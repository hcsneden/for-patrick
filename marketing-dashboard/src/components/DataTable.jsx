export function DataTable({ data }) {
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateRoas = (row) => {
    const totalSpend = row.metaSpend + row.googleSpend;
    const totalConv = row.metaConv + row.googleConv;
    return totalSpend > 0 ? (totalConv / totalSpend).toFixed(2) : '0.00';
  };

  return (
    <div className="table-card">
      <h2>Detailed Monthly Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Meta Spend</th>
            <th>Meta Conv. Value</th>
            <th>Google Spend</th>
            <th>Google Conv. Value</th>
            <th>Total ROAS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td><strong>{row.month}</strong></td>
              <td className="platform-meta">{formatCurrency(row.metaSpend)}</td>
              <td className="platform-meta">{formatCurrency(row.metaConv)}</td>
              <td className="platform-google">{formatCurrency(row.googleSpend)}</td>
              <td className="platform-google">{formatCurrency(row.googleConv)}</td>
              <td className="positive">{calculateRoas(row)}x</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
