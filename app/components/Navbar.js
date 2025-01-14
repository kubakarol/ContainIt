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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
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
                  <a className="nav-link" href="/voyages">Available Voyages</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/reservations">My Reservations</a>
                </li>
              </>
            )}
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/ships">Ships</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/voyages">Voyages</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/reservations">Reservations</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/users">Users</a>
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
