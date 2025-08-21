import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Transfers() {
  const [form, setForm] = useState({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userBase = localStorage.getItem('base');

  useEffect(() => {
    async function loadData() {
      const [resTransfers, resBases, resEquipment] = await Promise.all([
        fetch(`${API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resTransfers.ok) setTransfers(await resTransfers.json());
      if (resBases.ok) setBases(await resBases.json());
      if (resEquipment.ok) setEquipmentList(await resEquipment.json());
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (userRole === 'Logistics' && userBase) {
      const baseObj = bases.find((b) => b.name === userBase);
      if (baseObj) {
        setForm(f => ({ ...f, fromBase: baseObj._id, toBase: '' }));
      }
    } else if (userRole === 'Admin') {
      setForm(f => ({ ...f, fromBase: '', toBase: '' }));
    }
  }, [bases, userBase, userRole]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.fromBase === form.toBase) {
      alert('From Base and To Base cannot be the same.');
      return;
    }
    const res = await fetch(`${API_BASE_URL}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
      const updatedTransfers = await (await fetch(`${API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${token}` } })).json();
      setTransfers(updatedTransfers);
    } else {
      alert('Failed to record transfer');
    }
  }

  const baseOptionsFrom = userRole === 'Admin' ? bases : bases.filter(b => b.name === userBase);
  const baseOptionsTo = bases;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl mb-6 font-semibold">Record Transfer</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">

        <select
          name="fromBase"
          value={form.fromBase}
          onChange={onChange}
          className="p-2 border rounded"
          required
          disabled={userRole === 'Logistics'}
        >
          <option value="">Select From Base</option>
          {baseOptionsFrom.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          name="toBase"
          value={form.toBase}
          onChange={onChange}
          className="p-2 border rounded"
          required
          disabled={false}
        >
          <option value="">Select To Base</option>
          {baseOptionsTo.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select name="equipment" value={form.equipment} onChange={onChange} className="p-2 border rounded" required>
          <option value="">Select Equipment</option>
          {equipmentList.map((eq) => (
            <option key={eq._id} value={eq._id}>
              {eq.name}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={onChange}
          placeholder="Quantity"
          min={1}
          required
          className="p-2 border rounded"
        />

        <input
          name="transferDate"
          type="date"
          value={form.transferDate}
          onChange={onChange}
          required
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition">
          Record Transfer
        </button>
      </form>

      <h2 className="text-2xl mb-4 font-semibold">Transfer History</h2>
      <ul className="border p-4 rounded max-h-60 overflow-auto space-y-2">
        {transfers.length === 0 && <li>No transfers yet.</li>}
        {transfers.map((t) => (
          <li key={t._id} className="border-b pb-1">{`${t.transferDate?.slice(0, 10)} - From ${t.fromBase?.name || t.fromBase} To ${t.toBase?.name || t.toBase} - ${t.equipment?.name || t.equipment} - Qty: ${t.quantity}`}</li>
        ))}
      </ul>
    </div>
  );
}
