import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = {
  google: { main: '#4f46e5', bg: 'rgba(79, 70, 229, 0.7)', light: 'rgba(79, 70, 229, 0.1)' },
  meta: { main: '#3b82f6', bg: 'rgba(59, 130, 246, 0.7)', light: 'rgba(59, 130, 246, 0.1)' },
  shopify: { main: '#10b981', bg: 'rgba(16, 185, 129, 0.7)', light: 'rgba(16, 185, 129, 0.1)' },
};

export function RevenueChart({ chartData }) {
  const [stacked, setStacked] = useState(true);

  const data = {
    labels: chartData.formattedMonths,
    datasets: [
      {
        label: 'Google Revenue',
        data: chartData.google.revenue,
        borderColor: COLORS.google.main,
        backgroundColor: COLORS.google.light,
        tension: 0.3,
        fill: stacked ? 'origin' : false,
      },
      {
        label: 'Meta Revenue',
        data: chartData.meta.revenue,
        borderColor: COLORS.meta.main,
        backgroundColor: COLORS.meta.light,
        tension: 0.3,
        fill: stacked ? 'origin' : false,
      },
      {
        label: 'Shopify Revenue',
        data: chartData.shopify.revenue,
        borderColor: COLORS.shopify.main,
        backgroundColor: COLORS.shopify.light,
        tension: 0.3,
        fill: stacked ? 'origin' : false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => formatCurrency(v) },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="card rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Revenue by Month</h2>
        <button
          onClick={() => setStacked(!stacked)}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
        >
          Toggle Stack
        </button>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function SpendChart({ chartData }) {
  const data = {
    labels: chartData.formattedMonths,
    datasets: [
      {
        label: 'Google Spend',
        data: chartData.google.spend,
        borderColor: COLORS.google.main,
        backgroundColor: COLORS.google.light,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Meta Spend',
        data: chartData.meta.spend,
        borderColor: COLORS.meta.main,
        backgroundColor: COLORS.meta.light,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => formatCurrency(v) },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="card rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Spend by Month</h2>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function OrdersChart({ chartData }) {
  const [stacked, setStacked] = useState(true);

  const data = {
    labels: chartData.formattedMonths,
    datasets: [
      {
        label: 'Google Orders',
        data: chartData.google.orders,
        backgroundColor: COLORS.google.bg,
        borderColor: COLORS.google.main,
        borderWidth: 1,
      },
      {
        label: 'Meta Orders',
        data: chartData.meta.orders,
        backgroundColor: COLORS.meta.bg,
        borderColor: COLORS.meta.main,
        borderWidth: 1,
      },
      {
        label: 'Shopify Orders',
        data: chartData.shopify.orders,
        backgroundColor: COLORS.shopify.bg,
        borderColor: COLORS.shopify.main,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { stacked },
      y: { stacked, beginAtZero: true, ticks: { precision: 0 } },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="card rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Orders by Month</h2>
        <button
          onClick={() => setStacked(!stacked)}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
        >
          Toggle Stack
        </button>
      </div>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export function RoasChart({ chartData }) {
  const data = {
    labels: chartData.formattedMonths,
    datasets: [
      {
        label: 'Google ROAS',
        data: chartData.google.roas,
        borderColor: COLORS.google.main,
        backgroundColor: COLORS.google.light,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Meta ROAS',
        data: chartData.meta.roas,
        borderColor: COLORS.meta.main,
        backgroundColor: COLORS.meta.light,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="card rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">ROAS by Month</h2>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function SourcePieChart({ totals }) {
  const data = {
    labels: ['Google', 'Meta', 'Shopify'],
    datasets: [{
      data: [totals.google, totals.meta, totals.shopify],
      backgroundColor: [COLORS.google.bg, COLORS.meta.bg, COLORS.shopify.bg],
      borderColor: [COLORS.google.main, COLORS.meta.main, COLORS.shopify.main],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
            return `${ctx.label}: ${formatCurrency(ctx.raw)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Performance by Source</h2>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export function EfficiencyMetrics({ kpis }) {
  const maxRoas = Math.max(kpis.roas.value, 5);
  const maxAov = Math.max(kpis.aov.value, 200);
  const maxCac = Math.max(kpis.cac.value, 50);

  return (
    <div className="card rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Efficiency Metrics</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">ROAS</span>
            <span className="text-sm">{kpis.roas.value.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${Math.min((kpis.roas.value / maxRoas) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">AOV</span>
            <span className="text-sm">{formatCurrency(kpis.aov.value)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${Math.min((kpis.aov.value / maxAov) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">CAC</span>
            <span className="text-sm">{formatCurrency(kpis.cac.value)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${Math.min((kpis.cac.value / maxCac) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
