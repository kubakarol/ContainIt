"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Dekodowanie JWT
        setRole(payload.role); // Ustawienie roli użytkownika
      } catch (err) {
        console.error("Invalid token:", err);
        router.push("/"); // Przekierowanie na stronę główną, jeśli token jest nieprawidłowy
      }
    } else {
      router.push("/"); // Przekierowanie na stronę główną, jeśli brak tokena
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      // Wyślij żądanie POST do endpointu logout
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Usuń token z localStorage
      localStorage.removeItem("token");

      // Przekieruj na stronę główną
      router.push("/");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/home">ContainIT</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {role === "user" && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/getAllVoyages">Available Voyages</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/myReservations">My Reservations</a>
                </li>
              </>
            )}
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/getAllShips">Ships</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/voyagesAdmin">Voyages</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/reservationsAdmin">Reservations</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/getAllUsers">Users</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/analytics">Analytics</a>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className="btn btn-outline-light ms-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
