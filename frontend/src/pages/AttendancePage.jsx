import React, { useEffect, useState } from "react";
import api from "../api";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    status: "present",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [empRes, attRes] = await Promise.all([
        api.get("employees/"),
        api.get("attendance/"),
      ]);
      setEmployees(empRes.data);
      setRecords(attRes.data);
    } catch (e) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await api.post("attendance/", form);
      setForm({ employee: "", date: "", status: "present" });
      loadData();
    } catch (e) {
      setError("Failed to mark attendance (maybe duplicate date for employee)");
    }
  }

  return (
    <div>
      <h1>Attendance</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <select
          value={form.employee}
          onChange={(e) => setForm({ ...form, employee: e.target.value })}
        >
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.employee_id} - {e.full_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <button type="submit">Mark Attendance</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !records.length && <div>No attendance records yet.</div>}

      {!loading && records.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>
                  {r.employee_employee_id} - {r.employee_name}
                </td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}