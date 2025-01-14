"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/users/getAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token w nagłówku autoryzacji
          },
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Users</h1>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        {users.length === 0 && !error && (
          <p>No users found.</p>
        )}
        {users.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
