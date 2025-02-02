"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Rejestracja modułów do działania wykresów
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics() {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularRoutes();
    fetchRevenueData();
  }, []);

  const fetchPopularRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/analytics/popularRoutes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch popular routes");
      }

      const data = await response.json();
      setPopularRoutes(data.popularRoutes);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/analytics/revenue", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch revenue data");
      }

      const data = await response.json();
      setRevenueData(data.revenueData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Analytics Dashboard</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Najpopularniejsze trasy */}
        <div className="mb-5">
          <h2 className="text-primary">Popular Routes</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Departure Port</th>
                <th>Arrival Port</th>
                <th>Total Reservations</th>
              </tr>
            </thead>
            <tbody>
              {popularRoutes.map((route, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{route._id.departurePort}</td>
                  <td>{route._id.arrivalPort}</td>
                  <td>{route.totalReservations}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Wykres słupkowy dla tras */}
          {popularRoutes.length > 0 && (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <Bar
                data={{
                  labels: popularRoutes.map(
                    (route) => `${route._id.departurePort} → ${route._id.arrivalPort}`
                  ),
                  datasets: [
                    {
                      label: "Total Reservations",
                      data: popularRoutes.map((route) => route.totalReservations),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { ticks: { font: { size: 12 } } },
                    y: { ticks: { font: { size: 12 } } },
                  },
                }}
                height={300} // Zmniejszenie wysokości wykresu
              />
            </div>
          )}
        </div>

        {/* Zarobki statków */}
        <div>
          <h2 className="text-success">Ship Revenue</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Ship Name</th>
                <th>Total Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((ship, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ship.shipName}</td>
                  <td>${ship.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Wykres kołowy dla zarobków */}
          {revenueData.length > 0 && (
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <Pie
                data={{
                  labels: revenueData.map((ship) => ship.shipName),
                  datasets: [
                    {
                      label: "Total Revenue",
                      data: revenueData.map((ship) => ship.totalRevenue),
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
                height={300} // Zmniejszenie wysokości wykresu
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
