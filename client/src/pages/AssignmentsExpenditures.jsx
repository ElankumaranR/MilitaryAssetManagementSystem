import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AssignmentsExpenditures() {
  const [assignForm, setAssignForm] = useState({ base: '', equipment: '', personnel: '', quantity: '', assignmentDate: '' });
  const [expForm, setExpForm] = useState({ base: '', equipment: '', quantity: '', expenditureDate: '', reason: '' });
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);

  useEffect(() => {
    loadAssignments();
    loadExpenditures();
  }, []);

  async function loadAssignments() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/assignments`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setAssignments(await res.json());
  }

  async function loadExpenditures() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/expenditures`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setExpenditures(await res.json());
  }

  async function handleAssignSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...assignForm, quantity: Number(assignForm.quantity) }),
    });
    if (res.ok) {
      setAssignForm({ base: '', equipment: '', personnel: '', quantity: '', assignmentDate: '' });
      loadAssignments();
    } else alert('Failed to record assignment');
  }

  async function handleExpSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/expenditures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...expForm, quantity: Number(expForm.quantity) }),
    });
    if (res.ok) {
      setExpForm({ base: '', equipment: '', quantity: '', expenditureDate: '', reason: '' });
      loadExpenditures();
    } else alert('Failed to record expenditure');
  }

  function onAssignChange(e) {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  }

  function onExpChange(e) {
    setExpForm({ ...expForm, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-2 gap-12">
      <div>
        <h2 className="text-3xl mb-6 font-semibold">Asset Assignment</h2>
        <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4 mb-10">
          <input name="base" value={assignForm.base} onChange={onAssignChange} placeholder="Base" required className="p-2 border rounded" />
          <input name="equipment" value={assignForm.equipment} onChange={onAssignChange} placeholder="Equipment" required className="p-2 border rounded" />
          <input name="personnel" value={assignForm.personnel} onChange={onAssignChange} placeholder="Personnel" required className="p-2 border rounded" />
          <input name="quantity" type="number" value={assignForm.quantity} onChange={onAssignChange} placeholder="Quantity" required className="p-2 border rounded" />
          <input name="assignmentDate" type="date" value={assignForm.assignmentDate} onChange={onAssignChange} required className="p-2 border rounded" />
          <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition">Record Assignment</button>
        </form>
        <h3 className="text-2xl mb-4 font-semibold">Assignments History</h3>
        <ul className="border p-4 rounded max-h-64 overflow-auto space-y-2">
          {assignments.length === 0 && <li>No assignments yet.</li>}
          {assignments.map(a => (
            <li key={a._id} className="border-b pb-1">{`${a.assignmentDate?.slice(0,10)} - ${a.base} - ${a.equipment} - Assigned to ${a.personnel} QTY: ${a.quantity}`}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-3xl mb-6 font-semibold">Asset Expenditure</h2>
        <form onSubmit={handleExpSubmit} className="flex flex-col gap-4 mb-10">
          <input name="base" value={expForm.base} onChange={onExpChange} placeholder="Base" required className="p-2 border rounded" />
          <input name="equipment" value={expForm.equipment} onChange={onExpChange} placeholder="Equipment" required className="p-2 border rounded" />
          <input name="quantity" type="number" value={expForm.quantity} onChange={onExpChange} placeholder="Quantity" required className="p-2 border rounded" />
          <input name="expenditureDate" type="date" value={expForm.expenditureDate} onChange={onExpChange} required className="p-2 border rounded" />
          <input name="reason" value={expForm.reason} onChange={onExpChange} placeholder="Reason" required className="p-2 border rounded" />
          <button type="submit" className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition">Record Expenditure</button>
        </form>
        <h3 className="text-2xl mb-4 font-semibold">Expenditure History</h3>
        <ul className="border p-4 rounded max-h-64 overflow-auto space-y-2">
          {expenditures.length === 0 && <li>No expenditures yet.</li>}
          {expenditures.map(e => (
            <li key={e._id} className="border-b pb-1">{`${e.expenditureDate?.slice(0,10)} - ${e.base} - ${e.equipment} - QTY: ${e.quantity} Reason: ${e.reason}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
