"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/reservations/userReservations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Failed to fetch reservations");
        }

        const data = await response.json();
        setReservations(data.reservations);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">My Reservations</h1>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        {reservations.length === 0 && !error && (
          <p>No reservations found.</p>
        )}
        <div className="row">
          {reservations.map((reservation) => (
            <div className="col-md-4 mb-4" key={reservation.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Voyage on {reservation.voyage.shipName}
                  </h5>
                  <p className="card-text">
                    <strong>Departure:</strong> {reservation.voyage.departurePort} <br />
                    <strong>Arrival:</strong> {reservation.voyage.arrivalPort} <br />
                    <strong>Reserved Containers:</strong> {reservation.reservedContainers} <br />
                    <strong>Total Price:</strong> ${reservation.totalPrice} <br />
                    <strong>Status:</strong> {reservation.status} <br />
                    <strong>Reservation Date:</strong> {new Date(reservation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
