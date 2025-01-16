"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function AvailableVoyages() {
  const [voyages, setVoyages] = useState([]);
  const [ships, setShips] = useState([]);
  const [error, setError] = useState(null);
  const [editingVoyage, setEditingVoyage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role !== "admin") {
          alert("Access denied. Admins only.");
          window.location.href = "/";
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Invalid token:", err);
        window.location.href = "/";
        return;
      }
    } else {
      alert("No token found. Redirecting to login.");
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      try {
        const voyagesResponse = await axios.get("/api/voyages/getAllVoyages");
        const shipsResponse = await axios.get("/api/ships/getShips");
        setVoyages(voyagesResponse.data.voyages || []);
        setShips(shipsResponse.data.ships || []);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`/api/voyages/getVoyage/${id}`);
      setEditingVoyage(response.data);
    } catch (err) {
      console.error("Error fetching voyage details:", err.response?.data || err.message);
      alert("Failed to fetch voyage details.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `/api/voyages/updateVoyage/${editingVoyage.id}`,
        editingVoyage
      );
      setVoyages((prevVoyages) =>
        prevVoyages.map((voyage) =>
          voyage.id === editingVoyage.id ? response.data.voyage : voyage
        )
      );
      setEditingVoyage(null);
      alert("Voyage updated successfully");
    } catch (err) {
      console.error("Error updating voyage:", err.response?.data || err.message);
      alert("Failed to update voyage.");
    }
  };

  const handleChange = async (field, value) => {
    if (field === "ship") {
      try {
        // Pobierz dane nowego statku
        const response = await axios.get(`/api/ships/getShipById/${value}`);
        const ship = response.data.ship;

        // Zaktualizuj dane rejsu o nowe wartości z modelu statku
        setEditingVoyage((prev) => ({
          ...prev,
          [field]: value,
          availableContainers: ship.capacity,
          pricePerContainer: ship.pricePerContainer,
        }));
      } catch (err) {
        console.error("Error fetching ship details:", err.message);
        alert("Failed to fetch ship details.");
      }
    } else {
      setEditingVoyage((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Available Voyages</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          {voyages.map((voyage) => (
            <div className="col-md-4 mb-4" key={voyage.id || voyage._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{voyage.shipName}</h5>
                  <p className="card-text">
                    <strong>Departure:</strong> {voyage.departurePort} <br />
                    <strong>Arrival:</strong> {voyage.arrivalPort} <br />
                    <strong>Departure Date:</strong>{" "}
                    {new Date(voyage.departureDate).toLocaleDateString()} <br />
                    <strong>Arrival Date:</strong>{" "}
                    {new Date(voyage.arrivalDate).toLocaleDateString()} <br />
                    <strong>Available Containers:</strong>{" "}
                    {voyage.availableContainers} <br />
                    <strong>Price per Container:</strong> ${voyage.pricePerContainer}
                  </p>
                  <button
                    className="btn btn-warning w-50"
                    onClick={() => handleEdit(voyage.id || voyage._id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Okno edycji */}
      {editingVoyage && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Voyage</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingVoyage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Ship</label>
                  <select
                    className="form-select"
                    value={editingVoyage.ship}
                    onChange={(e) => handleChange("ship", e.target.value)}
                  >
                    {ships.map((ship) => (
                      <option key={ship.id || ship._id} value={ship.id || ship._id}>
                        {ship.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Departure Port</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingVoyage.departurePort}
                    onChange={(e) => handleChange("departurePort", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Arrival Port</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingVoyage.arrivalPort}
                    onChange={(e) => handleChange("arrivalPort", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Departure Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={new Date(editingVoyage.departureDate)
                      .toISOString()
                      .split("T")[0]}
                    onChange={(e) => handleChange("departureDate", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Arrival Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={new Date(editingVoyage.arrivalDate)
                      .toISOString()
                      .split("T")[0]}
                    onChange={(e) => handleChange("arrivalDate", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Available Containers</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingVoyage.availableContainers}
                    onChange={(e) => handleChange("availableContainers", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price per Container</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingVoyage.pricePerContainer}
                    onChange={(e) => handleChange("pricePerContainer", e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingVoyage(null)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
