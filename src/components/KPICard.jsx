export function KPICard({ label, value, change, format = 'currency' }) {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (format === 'number') {
      return val.toLocaleString();
    }
    if (format === 'decimal') {
      return val.toFixed(2);
    }
    return val;
  };

  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="card rounded-lg shadow p-4 min-h-[120px]">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{formatValue(value)}</div>
      <div className="kpi-change flex items-center">
        <span className={isPositive ? 'positive' : isNegative ? 'negative' : ''}>
          {Math.abs(change).toFixed(1)}%
        </span>
        {isPositive && (
          <svg className="w-4 h-4 ml-1 positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
        {isNegative && (
          <svg className="w-4 h-4 ml-1 negative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </div>
  );
}

export function KPIGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <KPICard label="Total Revenue" value={kpis.revenue.value} change={kpis.revenue.change} format="currency" />
      <KPICard label="Total Spend" value={kpis.spend.value} change={kpis.spend.change} format="currency" />
      <KPICard label="Total Orders" value={kpis.orders.value} change={kpis.orders.change} format="number" />
      <KPICard label="ROAS" value={kpis.roas.value} change={kpis.roas.change} format="decimal" />
      <KPICard label="AOV" value={kpis.aov.value} change={kpis.aov.change} format="currency" />
      <KPICard label="CAC" value={kpis.cac.value} change={kpis.cac.change} format="currency" />
    </div>
  );
}
