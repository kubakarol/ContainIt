"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Navbar dla administratora

export default function Ships() {
  const [ships, setShips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/ships/getShips", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token w nagłówku autoryzacji
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

    fetchShips();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Ships</h1>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        {ships.length === 0 && !error && (
          <p>No ships found.</p>
        )}
        {ships.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Price per Container</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship, index) => (
                <tr key={ship._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{ship.name}</td>
                  <td>{ship.capacity}</td>
                  <td>${ship.pricePerContainer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
