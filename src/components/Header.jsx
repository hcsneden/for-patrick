import { useTheme } from '../context/ThemeContext';

export function Header({ filters, onFilterChange, clientName }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">{clientName || 'Ecommerce Dashboard'}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <label htmlFor="date-range" className="text-sm font-medium">Month Range:</label>
          <select
            id="date-range"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {filters.dateRange === 'custom' && (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="start-month" className="text-sm font-medium">From:</label>
              <input
                type="month"
                id="start-month"
                value={filters.customStart}
                onChange={(e) => onFilterChange({ ...filters, customStart: e.target.value })}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="end-month" className="text-sm font-medium">To:</label>
              <input
                type="month"
                id="end-month"
                value={filters.customEnd}
                onChange={(e) => onFilterChange({ ...filters, customEnd: e.target.value })}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="source-filter" className="text-sm font-medium">Source:</label>
          <select
            id="source-filter"
            value={filters.source}
            onChange={(e) => onFilterChange({ ...filters, source: e.target.value })}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Sources</option>
            <option value="google">Google Ads</option>
            <option value="meta">Meta Ads</option>
            <option value="shopify">Shopify</option>
          </select>
        </div>

        <button
          onClick={toggleTheme}
          className="ml-auto md:ml-0 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
