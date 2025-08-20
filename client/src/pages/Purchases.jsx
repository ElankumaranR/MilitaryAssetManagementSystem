import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Purchases() {
  const [form, setForm] = useState({ base: '', equipment: '', quantity: '', purchaseDate: '', supplier: '' });
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/purchases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPurchases(await res.json());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm({ base: '', equipment: '', quantity: '', purchaseDate: '', supplier: '' });
      loadPurchases();
    } else alert('Failed to add purchase');
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl mb-6 font-semibold">Record Purchase</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <input
          name="base"
          value={form.base}
          onChange={onChange}
          placeholder="Base"
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
          name="purchaseDate"
          type="date"
          value={form.purchaseDate}
          onChange={onChange}
          required
          className="p-2 border rounded"
        />
        <input
          name="supplier"
          value={form.supplier}
          onChange={onChange}
          placeholder="Supplier"
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition">
          Add Purchase
        </button>
      </form>
      <h2 className="text-2xl mb-4 font-semibold">Purchase History</h2>
      <ul className="border p-4 rounded max-h-60 overflow-auto space-y-2">
        {purchases.length === 0 && <li>No purchases yet.</li>}
        {purchases.map(p => (
          <li key={p._id} className="border-b pb-1">{`${p.purchaseDate?.slice(0,10)} - ${p.base} - ${p.equipment} - Qty: ${p.quantity}`}</li>
        ))}
      </ul>
    </div>
  );
}
