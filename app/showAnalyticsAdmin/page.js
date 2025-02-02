"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { format } from "date-fns";

// Rejestracja modułów do działania wykresów
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

export default function Analytics() {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [shipRevenue, setShipRevenue] = useState([]);
  const [reservationsPerMonth, setReservationsPerMonth] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [travelTimes, setTravelTimes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularRoutes();
    fetchShipRevenue();
    fetchReservationsPerMonth();
    fetchAverageReservationPrice();
    fetchTopCustomers();
    fetchAverageTravelTime();
  }, []);

  const fetchData = async (endpoint, setStateFunction) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching ${endpoint}:`, errorData);
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const data = await response.json();
      setStateFunction(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPopularRoutes = () => fetchData("/api/analytics/popularRoutes", (data) => setPopularRoutes(data.popularRoutes));
  const fetchShipRevenue = () => fetchData("/api/analytics/shipRevenue", (data) => setShipRevenue(data.revenueData)); // POPRAWIONY ENDPOINT
  const fetchReservationsPerMonth = () => fetchData("/api/analytics/reservationsPerMonth", (data) => setReservationsPerMonth(data.reservationsPerMonth));
  const fetchAverageReservationPrice = () => fetchData("/api/analytics/averageReservationPrice", (data) => setAveragePrice(data.avgPrice || 0));
  const fetchTopCustomers = () => fetchData("/api/analytics/topCustomers", (data) => setTopCustomers(data.topCustomers));
  const fetchAverageTravelTime = () => fetchData("/api/analytics/averageTravelTime", (data) => setTravelTimes(data.travelTimes));

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
        </div>

        {/* Liczba rezerwacji na miesiąc */}
        <div className="mb-5">
          <h2 className="text-success">Reservations Per Month</h2>
          {reservationsPerMonth.length > 0 && (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <Line
                data={{
                  labels: reservationsPerMonth.map((item) => item._id),
                  datasets: [
                    {
                      label: "Total Reservations",
                      data: reservationsPerMonth.map((item) => item.totalReservations),
                      borderColor: "#36A2EB",
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
                height={300}
              />
            </div>
          )}
        </div>

        {/* Średnia cena rezerwacji */}
        <div className="mb-5">
          <h2 className="text-warning">Average Reservation Price</h2>
          <p className="fs-4">${averagePrice.toFixed(2)}</p>
        </div>

        {/* Najwięksi klienci */}
        <div className="mb-5">
          <h2 className="text-danger">Top Customers</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Total Spent ($)</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{customer.username}</td>
                  <td>${customer.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Średni czas podróży */}
        <div className="mb-5">
          <h2 className="text-info">Average Travel Time</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Departure Port</th>
                <th>Arrival Port</th>
                <th>Average Travel Time (Days)</th>
              </tr>
            </thead>
            <tbody>
              {travelTimes.map((route, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{route._id.departurePort}</td>
                  <td>{route._id.arrivalPort}</td>
                  <td>{(route.avgTravelTime / (1000 * 60 * 60 * 24)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {shipRevenue.map((ship, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ship.shipName}</td>
                  <td>${ship.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {shipRevenue.length > 0 && (
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <Pie
                data={{
                  labels: shipRevenue.map((ship) => ship.shipName),
                  datasets: [
                    {
                      label: "Total Revenue",
                      data: shipRevenue.map((ship) => ship.totalRevenue),
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true, 
                  plugins: { legend: { position: "bottom" } },
                }}
                height={250} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
