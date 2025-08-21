import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResourceManagement() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [bases, setBases] = useState([]);

  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Commander', base: '' });
  const [equipmentForm, setEquipmentForm] = useState({ name: '', type: '', price: '' });
  const [baseForm, setBaseForm] = useState({ name: '', location: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadAll() {
      const resUsers = await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (resUsers.ok) setUsers(await resUsers.json());
      const resEquip = await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } });
      if (resEquip.ok) setEquipment(await resEquip.json());
      const resBases = await fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } });
      if (resBases.ok) setBases(await resBases.json());
    }
    loadAll();
  }, [token]);

  function handleUserChange(e) { setUserForm({ ...userForm, [e.target.name]: e.target.value }); }
  function handleEquipmentChange(e) { setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value }); }
  function handleBaseChange(e) { setBaseForm({ ...baseForm, [e.target.name]: e.target.value }); }

  async function addUser(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(userForm)
    });
    if (res.ok) {
      setUsers(await (await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setUserForm({ username: '', password: '', role: 'Commander', base: '' });
    } else {
      alert('Error creating user');
    }
  }

  async function addEquipment(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/equipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...equipmentForm, price: Number(equipmentForm.price) })
    });
    if (res.ok) {
      setEquipment(await (await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setEquipmentForm({ name: '', type: '', price: '' });
    } else {
      alert('Error adding equipment');
    }
  }

  async function addBase(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/bases`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(baseForm)
    });
    if (res.ok) {
      setBases(await (await fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setBaseForm({ name: '', location: '' });
    } else {
      alert('Error adding base');
    }
  }

  const TabButton = ({ label, t }) => (
    <button
      className={`px-4 py-2 rounded-t font-semibold ${tab === t ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
      onClick={() => setTab(t)}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resource Management</h1>
      <div className="flex space-x-4 mb-8">
        <TabButton label="Users" t="users" />
        <TabButton label="Equipment" t="equipment" />
        <TabButton label="Bases" t="bases" />
      </div>

      {tab === 'users' && (
        <div>
          <form onSubmit={addUser} className="space-y-4 bg-gray-50 p-4 rounded shadow mb-8">
            <h2 className="text-xl font-semibold">Add User</h2>
            <input type="text" name="username" value={userForm.username} onChange={handleUserChange} placeholder="Username" required className="p-2 border rounded w-full" />
            <input type="password" name="password" value={userForm.password} onChange={handleUserChange} placeholder="Password" required className="p-2 border rounded w-full" />
            <select name="role" value={userForm.role} onChange={handleUserChange} className="p-2 border rounded w-full" required>
              <option value="Admin">Admin</option>
              <option value="Commander">Commander</option>
              <option value="Logistics">Logistics</option>
            </select>
            <input type="text" name="base" value={userForm.base} onChange={handleUserChange} placeholder="Base" required className="p-2 border rounded w-full" />
            <button type="submit" className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Add User</button>
          </form>
          <h3 className="text-lg font-bold mb-2">Users</h3>
          <ul className="space-y-2">
            {users.length === 0 ? <li className="text-gray-500">No users added.</li> : users.map((u,i) => <li key={u._id || i} className="p-2 border rounded">{u.username} - {u.role} - {u.base}</li>)}
          </ul>
        </div>
      )}

      {tab === 'equipment' && (
        <div>
          <form onSubmit={addEquipment} className="space-y-4 bg-gray-50 p-4 rounded shadow mb-8">
            <h2 className="text-xl font-semibold">Add Equipment</h2>
            <input type="text" name="name" value={equipmentForm.name} onChange={handleEquipmentChange} placeholder="Name" required className="p-2 border rounded w-full" />
            <input type="text" name="type" value={equipmentForm.type} onChange={handleEquipmentChange} placeholder="Type" required className="p-2 border rounded w-full" />
            <input type="number" name="price" value={equipmentForm.price} onChange={handleEquipmentChange} placeholder="Price" min="0" step="0.01" required className="p-2 border rounded w-full" />
            <button type="submit" className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Add Equipment</button>
          </form>
          <h3 className="text-lg font-bold mb-2">Equipment List</h3>
          <ul className="space-y-2">
            {equipment.length === 0 ? <li className="text-gray-500">No equipment added.</li> : equipment.map((eq,i) => <li key={eq._id || i} className="p-2 border rounded">{eq.name} — {eq.type} — ₹{eq.price}</li>)}
          </ul>
        </div>
      )}

      {tab === 'bases' && (
        <div>
          <form onSubmit={addBase} className="space-y-4 bg-gray-50 p-4 rounded shadow mb-8">
            <h2 className="text-xl font-semibold">Add Base</h2>
            <input type="text" name="name" value={baseForm.name} onChange={handleBaseChange} placeholder="Name" required className="p-2 border rounded w-full" />
            <input type="text" name="location" value={baseForm.location} onChange={handleBaseChange} placeholder="Location" required className="p-2 border rounded w-full" />
            <button type="submit" className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Add Base</button>
          </form>
          <h3 className="text-lg font-bold mb-2">Bases List</h3>
          <ul className="space-y-2">
            {bases.length === 0 ? <li className="text-gray-500">No bases added.</li> : bases.map((b,i) => <li key={b._id || i} className="p-2 border rounded">{b.name} — {b.location}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
