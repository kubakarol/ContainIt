"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar

export default function AvailableVoyages() {
  const [voyages, setVoyages] = useState([]);
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

  return (
    <div>
      {/* Navbar na górze */}
      <Navbar />

      {/* Treść strony */}
      <div className="container mt-4">
        <h1 className="mb-4">Available Voyages</h1>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
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
                    <strong>Available Containers:</strong> {voyage.availableContainers} <br />
                    <strong>Price per Container:</strong> ${voyage.pricePerContainer}
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => alert(`Selected voyage ID: ${voyage.id}`)}
                  >
                    Select Voyage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
