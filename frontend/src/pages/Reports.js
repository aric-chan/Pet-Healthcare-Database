import { useState } from "react";
import {
    getOwnerSummary,
    getMonthlyCalories,
    getUpcomingAppointments,
    getOverdueVaccines,
    getVaccineHistory,
    getDivisionPool,
    getDivisionResult,
    getActivePets
} from "../api/reports.js";

export default function Reports() {
    const [reportName, setReportName] = useState("");
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [petId, setPetId] = useState("");
    const [species, setSpecies] = useState("Dog");

    async function runReport(reportType) {
        try {
            setError("");
            setRows([]);
            setReportName(reportType);

            let response;

            if (reportType === "owner_summary") {
                response = await getOwnerSummary();
            } else if (reportType === "monthly_calories") {
                response = await getMonthlyCalories();
            } else if (reportType === "upcoming_appointments") {
                response = await getUpcomingAppointments();
            } else if (reportType === "overdue_vaccines") {
                response = await getOverdueVaccines();
            } else if (reportType === "active_pets") {
                response = await getActivePets();
            }

            setRows(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load report.");
        }
    }

    async function runVaccineHistory() {
        try {
            setError("");
            setRows([]);
            setReportName("vaccine_history");

            const response = await getVaccineHistory(petId);
            setRows(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load vaccine history.");
        }
    }

    async function runDivisionPool() {
        try {
            setError("");
            setReportName("Data Pool for Division");
            const response = await getDivisionPool();
            setRows(response.data.data || []);
        } catch (err) {
            setError("Failed to load division pool.");
        }
    }

    async function runDivisionResult() {
        try {
            setError("");
            setReportName(`Owners with EVERY breed of ${species}`);
            const response = await getDivisionResult(species);
            setRows(response.data.data || []);
        } catch (err) {
            setError("Failed to perform division.");
        }
    }

    function renderTable() {
        if (!rows.length) return <p>No data found.</p>;

        const headers = Object.keys(rows[0]);

        return (
            <table border="1" cellPadding="6">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td key={header}>{String(row[header])}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <h2>Reports</h2>

            <button onClick={() => runReport("owner_summary")}>Owner Summary</button>
            <button onClick={() => runReport("monthly_calories")}>Monthly Calories</button>
            <button onClick={() => runReport("upcoming_appointments")}>Upcoming Appointments</button>
            <button onClick={() => runReport("overdue_vaccines")}>Overdue Vaccines</button>
            <button onClick={() => runReport("active_pets")}>Active Pets (2+ Activities)</button>

            <div style={{ marginTop: "16px" }}>
                <h3>Vaccine History by Pet ID</h3>
                <input
                    type="number"
                    value={petId}
                    onChange={(e) => setPetId(e.target.value)}
                    placeholder="Enter pet ID"
                />
                <button onClick={runVaccineHistory}>Load Vaccine History</button>
            </div>

            <div style={{ marginTop: "16px", border: "1px solid #ccc" }}>
                <h3>Division</h3>
                <p>Find owners who own every breed of a selected species</p>
                
                <button onClick={runDivisionPool}> Show All Owners & Breeds (Join)</button>
                
                <div style={{ marginTop: "10px" }}>
                    <select value={species} onChange={(e) => setSpecies(e.target.value)}>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="OtherPet">OtherPet</option>
                    </select>
                    <button onClick={runDivisionResult} style={{ marginLeft: "8px" }}>
                        Find Owners with every breed
                    </button>
                </div>
            </div>

            <div style={{ marginTop: "20px" }}>
                {reportName && <h3>{reportName}</h3>}
                {error && <p>{error}</p>}
                {renderTable()}
            </div>
        </div>
    );
}