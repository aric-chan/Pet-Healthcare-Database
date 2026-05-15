import { useState, useEffect } from "react";
import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from "../api/appointments.js";

export default function Appointments() {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [newAppointment, setNewAppointment] = useState({
        appointment_id: "",
        pet_id: "",
        vet_id: "",
        appt_date: "",
        appt_type: "",
        notes: ""
    });

    const [editId, setEditId] = useState("");
    const [editFields, setEditFields] = useState({
        pet_id: "",
        vet_id: "",
        appt_date: "",
        appt_type: "",
        notes: ""
    });

    useEffect(() => {
        loadAppointments();

        function handleAppointmentsRefresh() {
            loadAppointments();
        }

        window.addEventListener("appointments-refresh", handleAppointmentsRefresh);

        return () => {
            window.removeEventListener("appointments-refresh", handleAppointmentsRefresh);
        };
    }, []);

    async function loadAppointments() {
        try {
            setError("");
            const response = await getAppointments();
            setRows(response.data.data || []);
        } catch (err) {
            console.error(err);
            setRows([]);
            setError("Failed to load appointments.");
        }
    }

    async function handleAdd() {
        try {
            setError("");
            setMessage("");
            const response = await addAppointment(newAppointment);
            setMessage(response.data.message);
            setNewAppointment({
                appointment_id: "",
                pet_id: "",
                vet_id: "",
                appt_date: "",
                appt_type: "",
                notes: ""
            });
            loadAppointments();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add appointment.");
        }
    }

    async function handleUpdate() {
        try {
            setError("");
            setMessage("");
            const response = await updateAppointment(editId, editFields);
            setMessage(response.data.message);
            setEditId("");
            setEditFields({
                pet_id: "",
                vet_id: "",
                appt_date: "",
                appt_type: "",
                notes: ""
            });
            loadAppointments();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update appointment.");
        }
    }

    async function handleDelete(id) {
        try {
            setError("");
            setMessage("");
            const response = await deleteAppointment(id);
            setMessage(response.data.message);
            loadAppointments();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete appointment.");
        }
    }

    function renderTable() {
        if (!rows.length) return <p>No appointments found.</p>;

        const headers = Object.keys(rows[0]);

        return (
            <table border="1" cellPadding="6">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td key={header}>{String(row[header])}</td>
                            ))}
                            <td>
                                <button onClick={() => {
                                    setEditId(row.APPOINTMENT_ID);
                                    setEditFields({
                                        pet_id: row.PET_ID,
                                        vet_id: row.VET_ID,
                                        appt_date: row.APPT_DATE,
                                        appt_type: row.APPT_TYPE,
                                        notes: row.NOTES
                                    });
                                }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(row.APPOINTMENT_ID)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <h2>Appointments</h2>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "20px" }}>
                <h3>Add Appointment</h3>
                <input
                    type="number"
                    placeholder="Appointment ID"
                    value={newAppointment.appointment_id}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_id: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Pet ID"
                    value={newAppointment.pet_id}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setNewAppointment({ ...newAppointment, pet_id: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Vet ID"
                    value={newAppointment.vet_id}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setNewAppointment({ ...newAppointment, vet_id: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Appointment Date"
                    value={newAppointment.appt_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appt_date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Appointment Type"
                    value={newAppointment.appt_type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appt_type: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                />
                <button onClick={handleAdd}>Add Appointment</button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h3>Update Appointment</h3>
                <input
                    type="number"
                    placeholder="Appointment ID to update"
                    value={editId}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setEditId(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="New Pet ID"
                    value={editFields.pet_id}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setEditFields({ ...editFields, pet_id: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="New Vet ID"
                    value={editFields.vet_id}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setEditFields({ ...editFields, vet_id: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="New Date"
                    value={editFields.appt_date}
                    onChange={(e) => setEditFields({ ...editFields, appt_date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Appointment Type"
                    value={editFields.appt_type}
                    onChange={(e) => setEditFields({ ...editFields, appt_type: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Notes"
                    value={editFields.notes}
                    onChange={(e) => setEditFields({ ...editFields, notes: e.target.value })}
                />
                <button onClick={handleUpdate}>Update Appointment</button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>All Appointments</h3>
                {renderTable()}
            </div>
        </div>
    );
}