"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [rejectComment, setRejectComment] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/reservations/getAllReservations", {
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

  // Funkcja do zatwierdzania rezerwacji
  const handleApprove = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/reservations/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId, status: "Approved" }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to approve reservation");
      }

      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "Approved" } : res
        )
      );

      alert("Reservation approved successfully");
    } catch (err) {
      console.error(err.message);
      alert("Failed to approve reservation");
    }
  };

  // Funkcja do odrzucania rezerwacji
  const handleReject = async (reservationId) => {
    const comment = rejectComment[reservationId] || "";
    if (!comment.trim()) {
      alert("Please provide a comment for rejection");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/reservations/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId, status: "Rejected", comment }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to reject reservation");
      }

      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId
            ? { ...res, status: "Rejected", comment }
            : res
        )
      );

      alert("Reservation rejected successfully");
    } catch (err) {
      console.error(err.message);
      alert("Failed to reject reservation");
    }
  };

  const handleCommentChange = (reservationId, value) => {
    setRejectComment((prev) => ({ ...prev, [reservationId]: value }));
  };

  // Podział rezerwacji na dwie sekcje
  const pendingReservations = reservations.filter((res) => res.status === "Pending");
  const otherReservations = reservations.filter((res) => res.status !== "Pending");

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Reservations</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {pendingReservations.length > 0 && (
          <div className="mb-5">
            <h2 className="text-warning">Pending Reservations</h2>
            <div className="row">
              {pendingReservations.map((reservation) => (
                <div className="col-md-6 mb-4" key={reservation.id}>
                  <div className="card border-warning">
                    <div className="card-body">
                      <h5 className="card-title">
                        Reservation ID: {reservation.id}
                      </h5>
                      <div className="card-text">
                        <strong>Ship Name:</strong> {reservation.voyage.shipName}
                        <br />
                        <strong>Departure:</strong> {reservation.voyage.departurePort}
                        <br />
                        <strong>Arrival:</strong> {reservation.voyage.arrivalPort}
                        <br />
                        <strong>Reserved Containers:</strong> {reservation.reservedContainers}
                        <br />
                        <strong>Total Price:</strong> ${reservation.totalPrice}
                      </div>
                      <div className="mt-3">
                        <button
                          className="btn btn-success me-2"
                          onClick={() => handleApprove(reservation.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(reservation.id)}
                        >
                          Reject
                        </button>
                        <textarea
                          className="form-control mt-2"
                          placeholder="Add rejection comment"
                          value={rejectComment[reservation.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(reservation.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherReservations.length > 0 && (
          <div>
            <h2 className="text-primary">Past Reservations</h2>
            <div className="row">
              {otherReservations.map((reservation) => (
                <div className="col-md-6 mb-4" key={reservation.id}>
                  <div className={`card ${reservation.status === "Approved" ? "border-success" : "border-danger"}`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        Reservation ID: {reservation.id}
                      </h5>
                      <div className="card-text">
                        <strong>Ship Name:</strong> {reservation.voyage.shipName}
                        <br />
                        <strong>Departure:</strong> {reservation.voyage.departurePort}
                        <br />
                        <strong>Arrival:</strong> {reservation.voyage.arrivalPort}
                        <br />
                        <strong>Reserved Containers:</strong> {reservation.reservedContainers}
                        <br />
                        <strong>Total Price:</strong> ${reservation.totalPrice}
                        <br />
                        <strong>Status:</strong> 
                        <span className={`text-${reservation.status === "Approved" ? "success" : "danger"}`}>
                          {" "}{reservation.status}
                        </span>
                        {reservation.status === "Rejected" && (
                          <div>
                            <strong>Comment:</strong>{" "}
                            {reservation.comment || "No comment provided"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
