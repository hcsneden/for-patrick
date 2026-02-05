import { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { KPIGrid } from './components/KPICard';
import { DataTable } from './components/DataTable';
import {
  RevenueChart,
  SpendChart,
  OrdersChart,
  RoasChart,
  SourcePieChart,
  EfficiencyMetrics
} from './components/Charts';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import {
  useGoogleSheets,
  filterData,
  calculateKPIs,
  groupByMonthAndSource,
  getTotalsBySource
} from './hooks/useGoogleSheets';
import { getSheetConfig } from './utils/sheetConfig';
import './index.css';

/**
 * URL PARAMETERS
 * ==============
 *
 * ?client=acme     → Load from clients.json config
 * ?sheet=2PACX-... → Load directly by sheet ID
 *
 * GOOGLE SHEET FORMAT
 * ===================
 * Required columns: date, source, spend, revenue, orders
 * - date: YYYY-MM-DD format
 * - source: google, meta, or shopify
 * - spend, revenue: numeric
 * - orders: integer
 */

function Dashboard() {
  const sheetConfig = useMemo(() => getSheetConfig(), []);
  const { data: rawData, loading, error: fetchError, refetch } = useGoogleSheets(sheetConfig.url);

  const [filters, setFilters] = useState({
    dateRange: '6',
    customStart: '',
    customEnd: '',
    source: 'all',
  });

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return filterData(rawData, filters);
  }, [rawData, filters]);

  // Calculate KPIs with comparison to previous period
  const kpis = useMemo(() => {
    // Get comparison period data
    const comparisonFilters = { ...filters };
    if (filters.dateRange !== 'custom') {
      const months = parseInt(filters.dateRange) || 6;
      const now = new Date();
      const comparisonEnd = new Date(now.getFullYear(), now.getMonth() - months, 0);
      const comparisonStart = new Date(now.getFullYear(), now.getMonth() - (months * 2), 1);
      comparisonFilters.dateRange = 'custom';
      comparisonFilters.customStart = `${comparisonStart.getFullYear()}-${String(comparisonStart.getMonth() + 1).padStart(2, '0')}`;
      comparisonFilters.customEnd = `${comparisonEnd.getFullYear()}-${String(comparisonEnd.getMonth() + 1).padStart(2, '0')}`;
    }
    const comparisonData = filterData(rawData, comparisonFilters);
    return calculateKPIs(filteredData, comparisonData);
  }, [rawData, filteredData, filters]);

  // Group data for charts
  const chartData = useMemo(() => {
    return groupByMonthAndSource(filteredData);
  }, [filteredData]);

  // Get totals by source for pie chart
  const sourceTotals = useMemo(() => {
    return getTotalsBySource(filteredData);
  }, [filteredData]);

  // Handle config errors
  if (sheetConfig.error) {
    return <Error message={sheetConfig.error} onRetry={() => window.location.reload()} />;
  }

  // Handle loading state
  if (sheetConfig.url && loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
      </div>
    );
  }

  // Handle fetch errors
  if (sheetConfig.url && fetchError) {
    return <Error message={fetchError} onRetry={refetch} />;
  }

  // Show message if no data
  if (!sheetConfig.url) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="card rounded-lg shadow p-8 text-center">
          
          <h2 className="text-xl font-semibold mb-4">No Data Source Configured</h2>
          <p className="mb-4">Add <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">?client=name</code> or <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">?sheet=ID</code> to the URL to load data.</p>
          <p className="text-sm opacity-70">Configure clients in <code>src/config/clients.json</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Header
        filters={filters}
        onFilterChange={setFilters}
        clientName={sheetConfig.clientName}
      />

      <KPIGrid kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart chartData={chartData} />
        <SpendChart chartData={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OrdersChart chartData={chartData} />
        <RoasChart chartData={chartData} />
      </div>

      <DataTable data={filteredData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SourcePieChart totals={sourceTotals} />
        <div className="card rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <div className="chart-container flex items-center justify-center text-gray-400">
            <p>Revenue vs Spend trends</p>
          </div>
        </div>
        <EfficiencyMetrics kpis={kpis} />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
