import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>Welcome to the Dashboard</h1>
        <p>This is your personalized dashboard based on your role.</p>
      </div>
    </div>
  );
}
