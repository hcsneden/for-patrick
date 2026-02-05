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
import { ChartCard } from './ChartCard';

// Register Chart.js components
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

const currencyCallback = (value) => '$' + value.toLocaleString();
const roasCallback = (value) => value + 'x';

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: currencyCallback
      }
    }
  }
};

export function AdSpendChart({ chartData }) {
  const data = {
    labels: chartData.months,
    datasets: [
      {
        label: 'Meta',
        data: chartData.metaSpend,
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2
      },
      {
        label: 'Google',
        data: chartData.googleSpend,
        backgroundColor: 'rgba(245, 101, 101, 0.7)',
        borderColor: 'rgba(245, 101, 101, 1)',
        borderWidth: 2
      }
    ]
  };

  return (
    <ChartCard title="Monthly Ad Spend Comparison">
      <Bar data={data} options={baseOptions} />
    </ChartCard>
  );
}

export function ConversionChart({ chartData }) {
  const data = {
    labels: chartData.months,
    datasets: [
      {
        label: 'Meta',
        data: chartData.metaConv,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3
      },
      {
        label: 'Google',
        data: chartData.googleConv,
        borderColor: 'rgba(245, 101, 101, 1)',
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3
      }
    ]
  };

  return (
    <ChartCard title="Monthly Conversion Value">
      <Line data={data} options={baseOptions} />
    </ChartCard>
  );
}

export function RoasChart({ chartData }) {
  const data = {
    labels: chartData.months,
    datasets: [{
      label: 'ROAS',
      data: chartData.roas,
      backgroundColor: 'rgba(72, 187, 120, 0.7)',
      borderColor: 'rgba(72, 187, 120, 1)',
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: roasCallback
        }
      }
    }
  };

  return (
    <ChartCard title="ROAS by Month">
      <Bar data={data} options={options} />
    </ChartCard>
  );
}

export function PlatformChart({ chartData }) {
  const totalMetaSpend = chartData.metaSpend.reduce((a, b) => a + b, 0);
  const totalGoogleSpend = chartData.googleSpend.reduce((a, b) => a + b, 0);
  const totalMetaConv = chartData.metaConv.reduce((a, b) => a + b, 0);
  const totalGoogleConv = chartData.googleConv.reduce((a, b) => a + b, 0);

  const data = {
    labels: ['Meta Spend', 'Google Spend', 'Meta Conv. Value', 'Google Conv. Value'],
    datasets: [{
      data: [totalMetaSpend, totalGoogleSpend, totalMetaConv, totalGoogleConv],
      backgroundColor: [
        'rgba(102, 126, 234, 0.7)',
        'rgba(245, 101, 101, 0.7)',
        'rgba(102, 126, 234, 0.4)',
        'rgba(245, 101, 101, 0.4)'
      ],
      borderColor: [
        'rgba(102, 126, 234, 1)',
        'rgba(245, 101, 101, 1)',
        'rgba(102, 126, 234, 1)',
        'rgba(245, 101, 101, 1)'
      ],
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <ChartCard title="Platform Distribution">
      <Doughnut data={data} options={options} />
    </ChartCard>
  );
}
