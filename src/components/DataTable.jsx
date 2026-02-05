import { useState, useMemo } from 'react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function DataTable({ data }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ column: 'date', direction: 'desc' });

  const filteredAndSorted = useMemo(() => {
    let result = [...data];

    // Filter by search
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(item =>
        item.date.toLocaleDateString().toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term) ||
        item.spend.toString().includes(term) ||
        item.revenue.toString().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sort.column === 'date') {
        comparison = a.date - b.date;
      } else if (sort.column === 'source') {
        comparison = a.source.localeCompare(b.source);
      } else {
        comparison = a[sort.column] - b[sort.column];
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, search, sort]);

  const handleSort = (column) => {
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ column }) => (
    <svg
      className={`w-4 h-4 inline ml-1 ${sort.column === column ? 'opacity-100' : 'opacity-30'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {sort.column === column && sort.direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );

  return (
    <div className="card rounded-lg shadow p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Detailed Performance</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('date')}>
                Month <SortIcon column="date" />
              </th>
              <th className="sortable" onClick={() => handleSort('source')}>
                Source <SortIcon column="source" />
              </th>
              <th className="sortable text-right" onClick={() => handleSort('spend')}>
                Spend <SortIcon column="spend" />
              </th>
              <th className="sortable text-right" onClick={() => handleSort('revenue')}>
                Revenue <SortIcon column="revenue" />
              </th>
              <th className="sortable text-right" onClick={() => handleSort('orders')}>
                Orders <SortIcon column="orders" />
              </th>
              <th className="sortable text-right" onClick={() => handleSort('roas')}>
                ROAS <SortIcon column="roas" />
              </th>
              <th className="sortable text-right" onClick={() => handleSort('aov')}>
                AOV <SortIcon column="aov" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No data available for the selected filters
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td>{item.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
                  <td className="capitalize">{item.source}</td>
                  <td className="text-right">{formatCurrency(item.spend)}</td>
                  <td className="text-right">{formatCurrency(item.revenue)}</td>
                  <td className="text-right">{item.orders}</td>
                  <td className="text-right">{item.roas.toFixed(2)}</td>
                  <td className="text-right">{formatCurrency(item.aov)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
