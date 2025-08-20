import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Transfers() {
  const [form, setForm] = useState({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/transfers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTransfers(await res.json());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if(form.fromBase === form.toBase) {
      alert('From Base and To Base cannot be the same.');
      return;
    }
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
      loadTransfers();
    } else alert('Failed to record transfer');
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl mb-6 font-semibold">Record Transfer</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <input
          name="fromBase"
          value={form.fromBase}
          onChange={onChange}
          placeholder="From Base"
          required
          className="p-2 border rounded"
        />
        <input
          name="toBase"
          value={form.toBase}
          onChange={onChange}
          placeholder="To Base"
          required
          className="p-2 border rounded"
        />
        <input
          name="equipment"
          value={form.equipment}
          onChange={onChange}
          placeholder="Equipment"
          required
          className="p-2 border rounded"
        />
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={onChange}
          placeholder="Quantity"
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
        {transfers.map(t => (
          <li key={t._id} className="border-b pb-1">{`${t.transferDate?.slice(0,10)} - From ${t.fromBase} To ${t.toBase} - ${t.equipment} - Qty: ${t.quantity}`}</li>
        ))}
      </ul>
    </div>
  );
}
