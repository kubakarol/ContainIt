import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/container-ship-ONE.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Navigation */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
        }}
      >
        <div className="container">
          <a className="navbar-brand" href="#">
            ContainIT
          </a>
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
            <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
              <li className="nav-item">
                <a href="/login" className="btn btn-primary">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a href="/register" className="btn btn-outline-light">
                  Register
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "20px 40px",
            borderRadius: "10px",
          }}
        >
          <h1 className="display-4 fw-bold">Welcome to ContainIT</h1>
          <p className="lead">
            Your comprehensive solution for managing container transportation
          </p>
        </div>
      </div>
    </div>
  );
}
