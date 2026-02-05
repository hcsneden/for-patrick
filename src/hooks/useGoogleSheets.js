import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';

/**
 * Parse a currency string like "$4,321.40" to a number
 */
function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  // Remove $, commas, and whitespace, then parse
  const cleaned = String(value).replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Custom hook to fetch data from a published Google Sheet
 *
 * To use this hook:
 * 1. Open your Google Sheet
 * 2. Go to File > Share > Publish to web
 * 3. Select the sheet tab you want to publish
 * 4. Choose "Comma-separated values (.csv)" format
 * 5. Click Publish and copy the URL
 *
 * The URL format should be:
 * https://docs.google.com/spreadsheets/d/e/{SPREADSHEET_ID}/pub?gid={SHEET_ID}&single=true&output=csv
 */
export function useGoogleSheets(csvUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!csvUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(csvUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }

          // Transform the data to match expected format
          const transformedData = results.data.map(row => ({
            month: row.Month || row.month,
            metaSpend: parseCurrency(row['Meta Spend'] || row.metaSpend),
            metaConv: parseCurrency(row['Meta Conversion Value'] || row['Meta Conv'] || row.metaConv),
            googleSpend: parseCurrency(row['Google Spend'] || row.googleSpend),
            googleConv: parseCurrency(row['Google Conversion Value'] || row['Google Conv'] || row.googleConv),
          })).filter(row => row.month); // Filter out rows without a month

          setData(transformedData);
          setLoading(false);
        },
        error: (parseError) => {
          setError(parseError.message);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [csvUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Calculate dashboard statistics from the monthly data
 */
export function calculateStats(data) {
  if (!data || data.length === 0) {
    return {
      totalAdSpend: 0,
      totalConversionValue: 0,
      averageRoas: 0,
      bestMonth: 'N/A',
      bestMonthValue: 0,
    };
  }

  const totalAdSpend = data.reduce((sum, row) => sum + row.metaSpend + row.googleSpend, 0);
  const totalConversionValue = data.reduce((sum, row) => sum + row.metaConv + row.googleConv, 0);
  const averageRoas = totalAdSpend > 0 ? totalConversionValue / totalAdSpend : 0;

  // Find best performing month
  let bestMonth = data[0];
  data.forEach(row => {
    const rowTotal = row.metaConv + row.googleConv;
    if (rowTotal > (bestMonth.metaConv + bestMonth.googleConv)) {
      bestMonth = row;
    }
  });

  return {
    totalAdSpend,
    totalConversionValue,
    averageRoas,
    bestMonth: bestMonth.month,
    bestMonthValue: bestMonth.metaConv + bestMonth.googleConv,
  };
}

/**
 * Prepare data for charts
 */
export function prepareChartData(data) {
  if (!data || data.length === 0) {
    return {
      months: [],
      metaSpend: [],
      googleSpend: [],
      metaConv: [],
      googleConv: [],
      roas: [],
    };
  }

  return {
    months: data.map(d => d.month),
    metaSpend: data.map(d => d.metaSpend),
    googleSpend: data.map(d => d.googleSpend),
    metaConv: data.map(d => d.metaConv),
    googleConv: data.map(d => d.googleConv),
    roas: data.map(d => {
      const totalSpend = d.metaSpend + d.googleSpend;
      return totalSpend > 0 ? (d.metaConv + d.googleConv) / totalSpend : 0;
    }),
  };
}
