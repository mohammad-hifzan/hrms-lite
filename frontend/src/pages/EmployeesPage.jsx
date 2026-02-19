import React, { useEffect, useState } from "react";
import api from "../api";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("employees/");
      setEmployees(res.data);
    } catch (e) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await api.post("employees/", form);
      setForm({ full_name: "", email: "", department: "" });
      loadEmployees();
    } catch (e) {
      setError("Failed to create employee (check for duplicates / invalid email)");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`employees/${id}/`);
      loadEmployees();
    } catch (e) {
      setError("Failed to delete employee");
    }
  }

  return (
    <div>
      <h1>Employees</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />
        <button type="submit">Add Employee</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !employees.length && <div>No employees yet.</div>}

      {!loading && employees.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id}>
                <td>{e.employee_id}</td>
                <td>{e.full_name}</td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                <td>
                  <button onClick={() => handleDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}