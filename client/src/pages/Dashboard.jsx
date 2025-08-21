import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [filters, setFilters] = useState({ base: '', equipment: '', fromDate: '', toDate: '' });
  const [metrics, setMetrics] = useState({});
  const [equipmentList, setEquipmentList] = useState([]);
  const [baseName, setBaseName] = useState('');
  const [submittedFilters, setSubmittedFilters] = useState(null);
  const token = localStorage.getItem('token');
  const userBase = localStorage.getItem('base'); // base ID from localStorage

  useEffect(() => {
    async function loadEquipment() {
      if (!token) return;
      const resEquipment = await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } });
      if (resEquipment.ok) setEquipmentList(await resEquipment.json());
    }
    loadEquipment();
  }, [token]);

  useEffect(() => {
    async function fetchBaseName() {
      if (userBase && token) {
        const res = await fetch(`${API_BASE_URL}/bases/${userBase}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const base = await res.json();
          setBaseName(base.name);
          setFilters(f => ({ ...f, base: userBase }));
        }
      }
    }
    fetchBaseName();
  }, [userBase, token]);

  useEffect(() => {
    async function loadMetrics() {
      if (!token || !submittedFilters) return;
      const qs = new URLSearchParams(submittedFilters).toString();
      const res = await fetch(`${API_BASE_URL}/dashboard?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        setMetrics({});
      }
    }
    loadMetrics();
  }, [submittedFilters, token]);

  function onClickNetMovement() {
    alert(
      `Purchases: ${metrics.purchases || 0}\nTransfers In: ${metrics.transfersIn || 0}\nTransfers Out: ${metrics.transfersOut || 0}`
    );
  }

  function onFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    // Ensure base id is included on submit
    setSubmittedFilters({ ...filters, base: userBase || filters.base });
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <form onSubmit={onSubmit} className="flex gap-4 mb-8 flex-wrap">
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={onFilterChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={onFilterChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="base"
          value={baseName}
          readOnly
          className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          placeholder="Base (fixed)"
        />
        <select
          name="equipment"
          value={filters.equipment}
          onChange={onFilterChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Equipment</option>
          {equipmentList.map((eq) => (
            <option key={eq._id} value={eq._id}>
              {eq.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
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
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClickNetMovement();
          }}
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
