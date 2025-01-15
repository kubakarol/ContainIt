"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar

export default function AvailableVoyages() {
  const [voyages, setVoyages] = useState([]);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Rola użytkownika

  useEffect(() => {
    // Pobierz role użytkownika z tokena JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

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

  // Funkcja do usuwania rejsu
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this voyage?")) return;

    try {
      const response = await fetch(`/api/voyages/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete voyage");
      }

      setVoyages((prevVoyages) => prevVoyages.filter((voyage) => voyage.id !== id));
      alert("Voyage deleted successfully");
    } catch (err) {
      console.error("Error deleting voyage:", err.message);
      alert("Failed to delete voyage");
    }
  };

  // Funkcja do edycji rejsu (przykład przekierowania)
  const handleEdit = (id) => {
    alert(`Edit voyage with ID: ${id}`);
    // Tutaj możesz przekierować do strony edycji rejsu:
    // router.push(`/voyages/edit/${id}`);
  };

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
                  {role === "admin" ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning w-50"
                        onClick={() => handleEdit(voyage.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger w-50"
                        onClick={() => handleDelete(voyage.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => alert(`Selected voyage ID: ${voyage.id}`)}
                    >
                      Select Voyage
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
