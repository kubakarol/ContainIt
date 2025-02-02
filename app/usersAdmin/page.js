"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap modala

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Funkcja do pobierania użytkowników
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Funkcja do resetowania focusa
  const resetFocus = () => {
    const firstFocusableElement = document.querySelector("button[data-bs-toggle='modal']");
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  };

  // Funkcja do zamknięcia modala poprawnie
  const closeModal = () => {
    const modalElement = document.getElementById("deleteUserModal");
    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
    modalInstance.hide();

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    resetFocus(); // Przywrócenie focusa
  };

  // Funkcja do usuwania użytkownika
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userToDelete._id }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to delete user");
      }

      await fetchUsers(); // Odśwież listę użytkowników
      closeModal(); // Zamknięcie modala
      setUserToDelete(null); // Resetowanie stanu
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Users</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {users.length === 0 && !error && <p>No users found.</p>}

        {users.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setUserToDelete(user)}
                      data-bs-toggle="modal"
                      data-bs-target="#deleteUserModal"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal do potwierdzenia usunięcia */}
        <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{userToDelete?.username}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteUser}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
