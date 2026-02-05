import { useMemo } from 'react';
import {
  Header,
  StatsGrid,
  DataTable,
  AdSpendChart,
  ConversionChart,
  RoasChart,
  PlatformChart
} from './components';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { useGoogleSheets, calculateStats, prepareChartData } from './hooks/useGoogleSheets';
import { getSheetConfig } from './utils/sheetConfig';

/**
 * URL PARAMETERS
 * ==============
 *
 * This dashboard supports two ways to specify which Google Sheet to use:
 *
 * 1. Client slug (configured in src/config/clients.json):
 *    ?client=acme
 *
 * 2. Direct sheet ID (from "Publish to web" URL):
 *    ?sheet=2PACX-1vXyz...
 *    ?sheet=2PACX-1vXyz...&gid=123  (for specific tab)
 *
 * If no parameters provided, shows demo data.
 *
 * ADDING NEW CLIENTS
 * ==================
 * Edit src/config/clients.json to add new client configurations.
 *
 * GOOGLE SHEET SETUP
 * ==================
 * 1. Create sheet with columns: Month, Meta Spend, Meta Conversion Value,
 *    Google Spend, Google Conversion Value
 * 2. File > Share > Publish to web > Select sheet > CSV format > Publish
 * 3. Copy the sheet ID from the published URL (the 2PACX-... part)
 */


function App() {
  // Get sheet config from URL parameters
  const sheetConfig = useMemo(() => getSheetConfig(), []);

  const { data: sheetData, loading, error: fetchError, refetch } = useGoogleSheets(sheetConfig.url);

  // Determine what data to show
  const data = sheetData.length > 0 ? sheetData : [];

  // Calculate stats and prepare chart data
  const stats = calculateStats(data);
  const chartData = prepareChartData(data);

  // Handle config errors (unknown client, etc.)
  if (sheetConfig.error) {
    return <Error message={sheetConfig.error} onRetry={() => window.location.reload()} />;
  }

  // Handle loading state
  if (sheetConfig.url && loading) {
    return <Loading />;
  }

  // Handle fetch errors
  if (sheetConfig.url && fetchError) {
    return <Error message={fetchError} onRetry={refetch} />;
  }

  return (
    <div className="container">
      <Header
        title={sheetConfig.clientName ? `${sheetConfig.clientName} - Ad Performance` : '2025 Ad Spend + Conversion Value'}
        subtitle="Year-to-date performance across Meta and Google platforms"
      />


      <StatsGrid stats={stats} />

      <div className="chart-grid">
        <AdSpendChart chartData={chartData} />
        <ConversionChart chartData={chartData} />
      </div>

      <div className="chart-grid">
        <RoasChart chartData={chartData} />
        <PlatformChart chartData={chartData} />
      </div>

      <DataTable data={data} />
    </div>
  );
}

export default App;
