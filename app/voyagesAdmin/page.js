"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AvailableVoyages() {
  const [voyages, setVoyages] = useState([]);
  const [ships, setShips] = useState([]);
  const [error, setError] = useState(null);
  const [editingVoyage, setEditingVoyage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingVoyageId, setDeletingVoyageId] = useState(null); // ID rejsu do usunięcia

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role !== "admin") {
          window.location.href = "/";
          return;
        }
      } catch (err) {
        console.error("Invalid token:", err);
        window.location.href = "/";
        return;
      }
    } else {
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      try {
        const voyagesResponse = await fetch("/api/voyages/getAllVoyages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const shipsResponse = await fetch("/api/ships/getShips", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!voyagesResponse.ok || !shipsResponse.ok) {
          throw new Error("Failed to fetch data.");
        }

        const voyagesData = await voyagesResponse.json();
        const shipsData = await shipsResponse.json();
        setVoyages(voyagesData.voyages || []);
        setShips(shipsData.ships || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`/api/voyages/getVoyage/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch voyage details.");
      }

      const data = await response.json();
      setEditingVoyage(data);
      setIsCreating(false);
    } catch (err) {
      console.error("Error fetching voyage details:", err.message);
    }
  };

  const handleCreate = () => {
    setEditingVoyage({
      ship: "",
      departurePort: "",
      arrivalPort: "",
      departureDate: "",
      arrivalDate: "",
      availableContainers: "",
      pricePerContainer: "",
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const response = await fetch("/api/voyages/createVoyage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            shipId: editingVoyage.ship,
            departurePort: editingVoyage.departurePort,
            arrivalPort: editingVoyage.arrivalPort,
            departureDate: editingVoyage.departureDate,
            arrivalDate: editingVoyage.arrivalDate,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create voyage.");
        }

        const data = await response.json();
        setVoyages((prevVoyages) => [...prevVoyages, data.voyage]);
      } else {
        const response = await fetch(`/api/voyages/updateVoyage/${editingVoyage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingVoyage),
        });

        if (!response.ok) {
          throw new Error("Failed to update voyage.");
        }

        const data = await response.json();
        setVoyages((prevVoyages) =>
          prevVoyages.map((voyage) =>
            voyage.id === editingVoyage.id ? data.voyage : voyage
          )
        );
      }
      setEditingVoyage(null);
      setIsCreating(false);
    } catch (err) {
      console.error("Error saving voyage:", err.message);
    }
  };

  const confirmDelete = (id) => {
    setDeletingVoyageId(id); // Otwórz modal potwierdzenia
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/voyages/deleteVoyage/${deletingVoyageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete voyage.");
      }

      setVoyages((prevVoyages) =>
        prevVoyages.filter((voyage) => voyage.id !== deletingVoyageId)
      );
      setDeletingVoyageId(null); // Zamknij modal po usunięciu
    } catch (err) {
      console.error("Error deleting voyage:", err.message);
    }
  };

  const handleChange = async (field, value) => {
    if (field === "ship") {
      try {
        const response = await fetch(`/api/ships/getShipById/${value}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch ship details.");
        }

        const data = await response.json();
        const ship = data.ship;

        setEditingVoyage((prev) => ({
          ...prev,
          [field]: value,
          availableContainers: ship.capacity,
          pricePerContainer: ship.pricePerContainer,
        }));
      } catch (err) {
        console.error("Error fetching ship details:", err.message);
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Available Voyages</h1>
          <button className="btn btn-success" onClick={handleCreate}>
            + Create Voyage
          </button>
        </div>
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
                  <div className="d-flex justify-content-center gap-3">
                    {/* <button
                      className="btn btn-warning w-50"
                      onClick={() => handleEdit(voyage.id || voyage._id)}
                    >
                      Edit
                    </button> */}
                    <button
                      className="btn btn-danger w-50"
                      onClick={() => confirmDelete(voyage.id || voyage._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal edycji/tworzenia */}
      {editingVoyage && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isCreating ? "Create Voyage" : "Edit Voyage"}
                </h5>
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
                    <option value="">Select a ship</option>
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
                    value={editingVoyage.departureDate}
                    onChange={(e) => handleChange("departureDate", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Arrival Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editingVoyage.arrivalDate}
                    onChange={(e) => handleChange("arrivalDate", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Available Containers</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingVoyage.availableContainers}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price per Container</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingVoyage.pricePerContainer}
                    disabled
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
                  {isCreating ? "Create" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal potwierdzenia usunięcia */}
      {deletingVoyageId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeletingVoyageId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this voyage?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletingVoyageId(null)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
