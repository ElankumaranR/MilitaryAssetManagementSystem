import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [filters, setFilters] = useState({ base: '', equipment: '', fromDate: '', toDate: '' });
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const qs = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE_URL}/dashboard?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMetrics(await res.json());
    }
    load();
  }, [filters]);

  function onClickNetMovement() {
    alert(
      `Purchases: ${metrics.purchases || 0}\nTransfers In: ${metrics.transfersIn || 0}\nTransfers Out: ${metrics.transfersOut || 0}`,
    );
  }

  function onFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={onFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={onFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="base"
          placeholder="Base"
          value={filters.base}
          onChange={onFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="equipment"
          placeholder="Equipment"
          value={filters.equipment}
          onChange={onFilterChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Opening Balance</h3>
          <p className="text-3xl">{metrics.openingBalance || 0}</p>
        </div>
        <div
          onClick={onClickNetMovement}
          className="p-6 bg-gray-100 rounded shadow cursor-pointer hover:bg-green-100"
          role="button"
          tabIndex={0}
          onKeyPress={onClickNetMovement}
        >
          <h3 className="text-lg font-semibold mb-2">Net Movement</h3>
          <p className="text-3xl">{metrics.netMovement || 0}</p>
          <small>Click to see details</small>
        </div>
        <div className="p-6 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Closing Balance</h3>
          <p className="text-3xl">{metrics.closingBalance || 0}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Assigned</h3>
          <p className="text-3xl">{metrics.assignments || 0}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Expended</h3>
          <p className="text-3xl">{metrics.expended || 0}</p>
        </div>
      </div>
    </div>
  );
}
