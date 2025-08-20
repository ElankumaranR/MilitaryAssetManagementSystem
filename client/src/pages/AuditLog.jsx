import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function loadLogs() {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/auditlog`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Audit Log</h1>
      <table className="min-w-full border rounded shadow overflow-x-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">Timestamp</th>
            <th className="py-2 px-4">User</th>
            <th className="py-2 px-4">Action</th>
            <th className="py-2 px-4">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-5">No audit log entries.</td>
            </tr>
          )}
          {logs.map(log => (
            <tr key={log._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="py-2 px-4">{log.user}</td>
              <td className="py-2 px-4">{log.action}</td>
              <td className="py-2 px-4 whitespace-pre-wrap">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
