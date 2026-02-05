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

/**
 * CONFIGURATION
 * =============
 *
 * To connect your Google Sheet:
 * 1. Open your Google Sheet
 * 2. Go to File > Share > Publish to web
 * 3. Select the sheet tab with your data
 * 4. Choose "Comma-separated values (.csv)" as the format
 * 5. Click "Publish"
 * 6. Copy the published URL and paste it below
 *
 * Your Google Sheet should have columns named:
 * - Month (e.g., "January", "February", etc.)
 * - Meta Spend (e.g., 4321.40)
 * - Meta Conversion Value (e.g., 9142.30)
 * - Google Spend (e.g., 1824.56)
 * - Google Conversion Value (e.g., 6276.49)
 */

// Replace with your published Google Sheet CSV URL
// Example: 'https://docs.google.com/spreadsheets/d/e/2PACX-xxxxx/pub?gid=0&single=true&output=csv'
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/15PYOMv4HF0LBcTfahUcHm7tOb_f9uU_QXLiSUTsUbmg/edit?gid=0#gid=0';

// Sample data used when no Google Sheet URL is provided
const SAMPLE_DATA = [
  { month: 'January', metaSpend: 4321.40, metaConv: 9142.30, googleSpend: 1824.56, googleConv: 6276.49 },
  { month: 'February', metaSpend: 4115.22, metaConv: 8330.54, googleSpend: 1645.07, googleConv: 3993.68 },
  { month: 'March', metaSpend: 5584.94, metaConv: 9612.75, googleSpend: 1276.88, googleConv: 4426.43 },
  { month: 'April', metaSpend: 4498.37, metaConv: 11118.25, googleSpend: 2494.47, googleConv: 10119.55 },
  { month: 'May', metaSpend: 3709.17, metaConv: 10531.50, googleSpend: 2428.51, googleConv: 6500.10 },
  { month: 'June', metaSpend: 3606.99, metaConv: 12979.41, googleSpend: 2162.32, googleConv: 6872.00 },
  { month: 'July', metaSpend: 3704.67, metaConv: 17564.88, googleSpend: 2390.93, googleConv: 7625.60 },
  { month: 'August', metaSpend: 5755.25, metaConv: 17230.33, googleSpend: 2410.61, googleConv: 10229.51 },
  { month: 'September', metaSpend: 4481.91, metaConv: 13483.06, googleSpend: 3060.60, googleConv: 8556.69 },
  { month: 'October', metaSpend: 3698.09, metaConv: 14089.72, googleSpend: 2821.66, googleConv: 7558.11 },
  { month: 'November', metaSpend: 4251.89, metaConv: 22860.90, googleSpend: 3707.63, googleConv: 17394.08 },
  { month: 'December', metaSpend: 4165.59, metaConv: 14419.60, googleSpend: 2559.59, googleConv: 5576.10 }
];

function App() {
  const { data: sheetData, loading, error, refetch } = useGoogleSheets(GOOGLE_SHEET_URL);

  // Use sheet data if available, otherwise use sample data
  const data = GOOGLE_SHEET_URL && sheetData.length > 0 ? sheetData : SAMPLE_DATA;
  const isUsingSampleData = !GOOGLE_SHEET_URL || sheetData.length === 0;

  // Calculate stats and prepare chart data
  const stats = calculateStats(data);
  const chartData = prepareChartData(data);

  if (GOOGLE_SHEET_URL && loading) {
    return <Loading />;
  }

  if (GOOGLE_SHEET_URL && error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div className="container">
      <Header
        title="2025 Ad Spend + Conversion Value"
        subtitle="Year-to-date performance across Meta and Google platforms"
      />

      {isUsingSampleData && (
        <div className="header" style={{ background: '#fef3c7', marginBottom: '25px' }}>
          <p style={{ color: '#92400e', margin: 0 }}>
            <strong>Demo Mode:</strong> Showing sample data. To connect your Google Sheet,
            edit <code>src/App.jsx</code> and set the <code>GOOGLE_SHEET_URL</code> variable.
          </p>
        </div>
      )}

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
