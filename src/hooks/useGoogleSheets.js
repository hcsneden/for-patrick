import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';

/**
 * Parse a currency string like "$4,321.40" to a number
 */
function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const cleaned = String(value).replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Custom hook to fetch data from a published Google Sheet
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
        dynamicTyping: false,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }

          // Transform the data to match expected format
          const transformedData = results.data.map(row => {
            // Parse date - support various formats
            let date = null;
            const dateStr = row.date || row.Date || row.month || row.Month;
            if (dateStr) {
              date = new Date(dateStr);
              if (isNaN(date.getTime())) {
                // Try parsing as "Month Year" format
                const parsed = Date.parse(dateStr + ' 1, 2024');
                if (!isNaN(parsed)) {
                  date = new Date(parsed);
                }
              }
            }

            const spend = parseCurrency(row.spend || row.Spend || row['Meta Spend'] || 0) +
                          parseCurrency(row['Google Spend'] || 0);
            const revenue = parseCurrency(row.revenue || row.Revenue || row['Meta Conversion Value'] || row['Meta Conv'] || 0) +
                            parseCurrency(row['Google Conversion Value'] || row['Google Conv'] || 0);
            const orders = parseInt(row.orders || row.Orders || 0) || 0;
            const source = (row.source || row.Source || 'unknown').toLowerCase();

            return {
              date,
              source,
              spend,
              revenue,
              orders,
              roas: spend > 0 ? revenue / spend : 0,
              aov: orders > 0 ? revenue / orders : 0,
              cac: orders > 0 ? spend / orders : 0,
            };
          }).filter(row => row.date && !isNaN(row.date.getTime()));

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
 * Filter data by date range and source
 */
export function filterData(data, { dateRange, customStart, customEnd, source }) {
  if (!data || data.length === 0) return [];

  let startDate, endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  if (dateRange === 'custom' && customStart && customEnd) {
    startDate = new Date(customStart + '-01');
    endDate = new Date(customEnd + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
  } else if (dateRange === 'ytd') {
    startDate = new Date(new Date().getFullYear(), 0, 1);
  } else {
    const months = parseInt(dateRange) || 6;
    const now = new Date();
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  }

  return data.filter(item => {
    if (item.date < startDate || item.date > endDate) return false;
    if (source !== 'all' && item.source !== source) return false;
    return true;
  });
}

/**
 * Calculate KPI statistics from filtered data
 */
export function calculateKPIs(filteredData, comparisonData = []) {
  const calc = (data) => {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalSpend = data.reduce((sum, item) => sum + item.spend, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
    return {
      revenue: totalRevenue,
      spend: totalSpend,
      orders: totalOrders,
      roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      aov: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      cac: totalOrders > 0 ? totalSpend / totalOrders : 0,
    };
  };

  const current = calc(filteredData);
  const previous = calc(comparisonData);

  const percentChange = (curr, prev) => {
    if (prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    revenue: { value: current.revenue, change: percentChange(current.revenue, previous.revenue) },
    spend: { value: current.spend, change: percentChange(current.spend, previous.spend) },
    orders: { value: current.orders, change: percentChange(current.orders, previous.orders) },
    roas: { value: current.roas, change: percentChange(current.roas, previous.roas) },
    aov: { value: current.aov, change: percentChange(current.aov, previous.aov) },
    cac: { value: current.cac, change: percentChange(current.cac, previous.cac) },
  };
}

/**
 * Group data by month and source for charts
 */
export function groupByMonthAndSource(data) {
  const grouped = {};

  data.forEach(item => {
    const monthKey = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = {
        google: { revenue: 0, spend: 0, orders: 0 },
        meta: { revenue: 0, spend: 0, orders: 0 },
        shopify: { revenue: 0, spend: 0, orders: 0 },
      };
    }

    const source = item.source || 'unknown';
    if (grouped[monthKey][source]) {
      grouped[monthKey][source].revenue += item.revenue;
      grouped[monthKey][source].spend += item.spend;
      grouped[monthKey][source].orders += item.orders;
    }
  });

  const months = Object.keys(grouped).sort();

  return {
    months,
    formattedMonths: months.map(m => {
      const [year, month] = m.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }),
    google: {
      revenue: months.map(m => grouped[m].google.revenue),
      spend: months.map(m => grouped[m].google.spend),
      orders: months.map(m => grouped[m].google.orders),
      roas: months.map(m => grouped[m].google.spend > 0 ? grouped[m].google.revenue / grouped[m].google.spend : 0),
    },
    meta: {
      revenue: months.map(m => grouped[m].meta.revenue),
      spend: months.map(m => grouped[m].meta.spend),
      orders: months.map(m => grouped[m].meta.orders),
      roas: months.map(m => grouped[m].meta.spend > 0 ? grouped[m].meta.revenue / grouped[m].meta.spend : 0),
    },
    shopify: {
      revenue: months.map(m => grouped[m].shopify.revenue),
      spend: months.map(m => grouped[m].shopify.spend),
      orders: months.map(m => grouped[m].shopify.orders),
      roas: months.map(m => grouped[m].shopify.spend > 0 ? grouped[m].shopify.revenue / grouped[m].shopify.spend : 0),
    },
  };
}

/**
 * Get totals by source for pie chart
 */
export function getTotalsBySource(data) {
  const totals = { google: 0, meta: 0, shopify: 0 };

  data.forEach(item => {
    if (totals[item.source] !== undefined) {
      totals[item.source] += item.revenue;
    }
  });

  return totals;
}
