import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Owners from "./pages/Owners.js";
import Pets from "./pages/Pets.js";
import Reports from "./pages/Reports.js";
import Vets from "./pages/Vets.js";
import Appointments from "./pages/Appointment.js";

function App() {
  const [vets, setVets] = useState([]);
  useEffect(() => {}, []);
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: "1rem", background: "#f0f0f0", marginBottom: "20px" }}>
          <Link to="/" style={{ margin: "0 10px" }}>Home</Link>
          | <Link to="/owners" style={{ margin: "0 10px" }}>Owners</Link>
          | <Link to="/pets" style={{ margin: "0 10px" }}>Pets</Link>
          | <Link to="/vets" style={{ margin: "0 10px" }}>Vets</Link>
          | <Link to="/appointments" style={{ margin: "0 10px" }}>Appointments</Link>
          | <Link to="/reports" style={{ margin: "0 10px" }}>Reports </Link>
        </nav>

        <h1>CPSC 304 Team 49 PetCare Management System</h1>

        <Routes>
          <Route path="/" element={<h2>Welcome to the Clinic</h2>} />
          
          <Route path="/owners" element={<Owners vets={vets} />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/vets" element={<Vets vets={vets} setVets={setVets} />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reports" element={<Reports />} />
          
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;