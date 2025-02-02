"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AvailableVoyages() {
  const [voyages, setVoyages] = useState([]);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [reservedContainers, setReservedContainers] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const response = await fetch("/api/voyages/getAllVoyages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch voyages");
        }

        const data = await response.json();
        setVoyages(data.voyages);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVoyages();
  }, []);

  const handleSelectVoyage = async (voyageId) => {
    try {
      const response = await fetch(`/api/voyages/getVoyage/${voyageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch voyage details");
      }

      const data = await response.json();
      setSelectedVoyage(data);
      setReservedContainers(1);
      setTotalPrice(data.pricePerContainer);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReserve = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/reservations/createReservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          voyageId: selectedVoyage.id,
          reservedContainers,
        }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to create reservation");
      }

      alert("Reservation created successfully!");
      setSelectedVoyage(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleContainerChange = (value) => {
    // Usunięcie znaków niebędących cyframi
    if (!Number.isInteger(value) || value === "" || value < 1) {
      setReservedContainers("");
      setTotalPrice(0); // Cena będzie 0, jeśli nic nie wpisano lub wpisano błędną wartość
      return;
    }
  
    // Po wpisaniu liczby całkowitej, nakładamy ograniczenie do maksymalnej dostępnej liczby kontenerów
    const containers = Math.min(value, selectedVoyage.availableContainers);
    setReservedContainers(containers);
    setTotalPrice(containers * selectedVoyage.pricePerContainer);
  };
  


  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Available Voyages</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {!selectedVoyage ? (
          <div className="row">
            {voyages.map((voyage) => (
              <div className="col-md-4 mb-4" key={voyage.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{voyage.shipName}</h5>
                    <p className="card-text">
                      <strong>Departure:</strong> {voyage.departurePort} <br />
                      <strong>Arrival:</strong> {voyage.arrivalPort} <br />
                      <strong>Departure Date:</strong> {new Date(voyage.departureDate).toLocaleDateString()} <br />
                      <strong>Arrival Date:</strong> {new Date(voyage.arrivalDate).toLocaleDateString()} <br />
                      <strong>Available Containers:</strong> {voyage.availableContainers}
                    </p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleSelectVoyage(voyage.id)}
                    >
                      Select Voyage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Voyage Details</h5>
                  <button className="btn-close" onClick={() => setSelectedVoyage(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Ship Name:</strong> {selectedVoyage.shipName}</p>
                  <p><strong>Departure:</strong> {selectedVoyage.departurePort}</p>
                  <p><strong>Arrival:</strong> {selectedVoyage.arrivalPort}</p>
                  <p><strong>Departure Date:</strong> {new Date(selectedVoyage.departureDate).toLocaleDateString()}</p>
                  <p><strong>Arrival Date:</strong> {new Date(selectedVoyage.arrivalDate).toLocaleDateString()}</p>
                  <p><strong>Available Containers:</strong> {selectedVoyage.availableContainers}</p>
                  <p><strong>Price per Container:</strong> ${selectedVoyage.pricePerContainer}</p>
                  <div className="mb-3">
                    <label className="form-label">Reserved Containers</label>
                    <input
                      type="number"
                      className="form-control"
                      value={reservedContainers}
                      onChange={(e) => handleContainerChange(Number(e.target.value))}
                      min="1"
                      max={selectedVoyage.availableContainers}
                    />
                  </div>
                  <p><strong>Total Price:</strong> ${totalPrice}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleReserve}>
                    Reserve
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedVoyage(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
