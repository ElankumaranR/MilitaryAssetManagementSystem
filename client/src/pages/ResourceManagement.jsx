import { useState } from 'react';

export default function ResourceManagement() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [bases, setBases] = useState([]);

  const [userForm, setUserForm] = useState({ username: '', role: 'Commander', base: '' });
  const [equipmentForm, setEquipmentForm] = useState({ name: '', type: '', price: '' });
  const [baseForm, setBaseForm] = useState({ name: '', location: '' });

  const TabButton = ({ label, t }) => (
    <button
      className={`px-4 py-2 rounded-t font-semibold ${tab === t ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
      onClick={() => setTab(t)}
    >
      {label}
    </button>
  );

  function handleUserChange(e) { setUserForm({ ...userForm, [e.target.name]: e.target.value }); }
  function handleEquipmentChange(e) { setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value }); }
  function handleBaseChange(e) { setBaseForm({ ...baseForm, [e.target.name]: e.target.value }); }

  function addUser(e) {
    e.preventDefault();
    setUsers([...users, userForm]);
    setUserForm({ username: '', role: 'Commander', base: '' });
  }

  function addEquipment(e) {
    e.preventDefault();
    setEquipment([...equipment, equipmentForm]);
    setEquipmentForm({ name: '', type: '', price: '' });
  }

  function addBase(e) {
    e.preventDefault();
    setBases([...bases, baseForm]);
    setBaseForm({ name: '', location: '' });
  }

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
            {users.length === 0 ? <li className="text-gray-500">No users added.</li> : users.map((u,i) => <li key={i} className="p-2 border rounded">{u.username} - {u.role} - {u.base}</li>)}
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
            {equipment.length === 0 ? <li className="text-gray-500">No equipment added.</li> : equipment.map((eq,i) => <li key={i} className="p-2 border rounded">{eq.name} — {eq.type} — ₹{eq.price}</li>)}
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
            {bases.length === 0 ? <li className="text-gray-500">No bases added.</li> : bases.map((b,i) => <li key={i} className="p-2 border rounded">{b.name} — {b.location}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
