"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

export default function Ships() {
  const [ships, setShips] = useState([]);
  const [error, setError] = useState(null);
  const [newShip, setNewShip] = useState({ name: "", capacity: "", pricePerContainer: "" });
  const [loading, setLoading] = useState(false);
  const [shipToDelete, setShipToDelete] = useState(null);

  useEffect(() => {
    fetchShips();
  }, []);

  const fetchShips = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ships/getShips", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch ships");
      }

      const data = await response.json();
      setShips(data.ships);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddShip = async (e) => {
    e.preventDefault();

    if (!newShip.name || !newShip.capacity || !newShip.pricePerContainer) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ships/addShip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newShip.name,
          capacity: Number(newShip.capacity),
          pricePerContainer: Number(newShip.pricePerContainer),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add ship");
      }

      setNewShip({ name: "", capacity: "", pricePerContainer: "" });
      fetchShips();

      // ✅ Zamknięcie modala po dodaniu statku
      const modalElement = document.getElementById("addShipModal");
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Obsługa usuwania statku
  const handleDeleteShip = async () => {
    if (!shipToDelete) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ships/deleteShip", {  // ✅ Remove ID from URL
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: shipToDelete._id }),  // ✅ Send ID in request body
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete ship");
      }
  
      fetchShips();
  
      // ✅ Close modal after deletion
      const modalElement = document.getElementById("deleteShipModal");
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
  
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
        <h1 className="mb-4">Ships</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addShipModal">
          Add New Ship
        </button>

        {ships.length === 0 && !error && <p>No ships found.</p>}

        {ships.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Price per Container</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship, index) => (
                <tr key={ship._id}>
                  <td>{index + 1}</td>
                  <td>{ship.name}</td>
                  <td>{ship.capacity}</td>
                  <td>${ship.pricePerContainer}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setShipToDelete(ship)}
                      data-bs-toggle="modal"
                      data-bs-target="#deleteShipModal"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal do dodawania nowego statku */}
        <div className="modal fade" id="addShipModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Ship</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddShip}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newShip.name}
                      onChange={(e) => setNewShip({ ...newShip, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newShip.capacity}
                      onChange={(e) => setNewShip({ ...newShip, capacity: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price per Container</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newShip.pricePerContainer}
                      onChange={(e) => setNewShip({ ...newShip, pricePerContainer: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Adding..." : "Add Ship"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modal do potwierdzenia usunięcia */}
        <div className="modal fade" id="deleteShipModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{shipToDelete?.name}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteShip} disabled={loading}>
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
