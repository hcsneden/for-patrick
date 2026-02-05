import { StatCard } from './StatCard';

export function StatsGrid({ stats }) {
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="stats-grid">
      <StatCard
        label="Total Ad Spend"
        value={formatCurrency(stats.totalAdSpend)}
        subtitle="Meta + Google Combined"
      />
      <StatCard
        label="Total Conversion Value"
        value={formatCurrency(stats.totalConversionValue)}
        subtitle="Revenue Generated"
      />
      <StatCard
        label="Average ROAS"
        value={`${stats.averageRoas.toFixed(2)}x`}
        subtitle="Return on Ad Spend"
      />
      <StatCard
        label="Best Month"
        value={stats.bestMonth}
        subtitle={`${formatCurrency(stats.bestMonthValue)} Conversion Value`}
      />
    </div>
  );
}
