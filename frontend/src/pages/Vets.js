import { useState, useEffect } from "react";
import { getVets, addVet, updateVet, deleteVet, searchVets, projectVets } from "../api/vets.js";

export default function Vets({vets, setVets}) {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [newVet, setNewVet] = useState({
        vet_id: "",
        name: "",
        clinic: "",
        speciality: ""
    });


    const [editId, setEditId] = useState("");
    const [editFields, setEditFields] = useState({
        name: "",
        clinic: "",
        speciality: ""
    });

    //selection and projection

    const [conditions, setConditions] = useState([
        { field: "name", value: "", operator: "AND" }
    ]);
    const [searchResults, setSearchResults] = useState([]);

    const ALL_COLUMNS = ["vet_id", "name", "clinic", "speciality"];
    const [selectedColumns, setSelectedColumns] = useState([...ALL_COLUMNS]);
    const [projectResults, setProjectResults] = useState([]);


    useEffect(() => {
        loadVets();
    }, []);

    async function loadVets() {
        try {
            setError("");
            const response = await getVets();
            setRows(response.data.data || []);
            console.log("Loaded vets:", response.data.data);
            setVets(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load vets.");
        }
    }

    async function handleAdd() {
        try {
            setError("");
            setMessage("");
            const response = await addVet(newVet);
            setMessage(response.data.message);
            setNewVet({ vet_id: "", name: "", clinic: "", speciality: "" });
            loadVets();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add vet.");
        }
    }

    async function handleUpdate() {
        try {
            setError("");
            setMessage("");
            const response = await updateVet(editId, editFields);
            setMessage(response.data.message);
            setEditId("");
            setEditFields({ name: "", clinic: "", speciality: "" });
            loadVets();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update vet.");
        }
    }

    async function handleDelete(id) {
        try {
            setError("");
            setMessage("");
            const response = await deleteVet(id);
            setMessage(response.data.message);
            loadVets();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete vet.");
        }
    }

    // selection handler
    function addCondition(operator) {
        setConditions([...conditions, { field: "name", value: "", operator }]);
    }

    function removeCondition(index) {
        setConditions(conditions.filter((_, i) => i !== index));
    }

    function updateCondition(index, key, value) {
        const updated = [...conditions];
        updated[index][key] = value;
        setConditions(updated);
    }

    async function handleSearch() {
        try {
            setError("");
            const response = await searchVets(conditions);
            setSearchResults(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to search vets.");
        }
    }

    // projection handler
    function toggleColumn(col) {
        if (selectedColumns.includes(col)) {
            setSelectedColumns(selectedColumns.filter(c => c !== col));
        } else {
            setSelectedColumns([...selectedColumns, col]);
        }
    }

    function moveColumn(index, direction) {
        const updated = [...selectedColumns];
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= updated.length) return;
        [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
        setSelectedColumns(updated);
    }

    async function handleProject() {
        try {
            setError("");
            if (selectedColumns.length === 0) {
                return setError("Please select at least one column.");
            }
            const response = await projectVets(selectedColumns);
            setProjectResults(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to project vets.");
        }
    }

    function renderTable(data = rows) {
        if (!data.length) return <p>No results found.</p>;

        const headers = Object.keys(data[0]);

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
                    {data.map((row, index) => (
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
            <h2>Veterinarians</h2>


            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "20px" }}>
                <h3>Add Veterinarian</h3>
                <input
                    type="number"
                    placeholder="Vet ID"
                    value={newVet.vet_id}
                    onChange={(e) => setNewVet({ ...newVet, vet_id: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={newVet.name}
                    onChange={(e) => setNewVet({ ...newVet, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Clinic"
                    value={newVet.clinic}
                    onChange={(e) => setNewVet({ ...newVet, clinic: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Speciality"
                    value={newVet.speciality}
                    onChange={(e) => setNewVet({ ...newVet, speciality: e.target.value })}
                />
                <button onClick={handleAdd}>Add Vet</button>
            </div>


            <div style={{ marginBottom: "20px" }}>
                <h3>Update Veterinarian</h3>
                <input
                    type="number"
                    placeholder="Vet ID to update"
                    value={editId}
                    onChange={(e) => setEditId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="New Name"
                    value={editFields.name}
                    onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Clinic"
                    value={editFields.clinic}
                    onChange={(e) => setEditFields({ ...editFields, clinic: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Speciality"
                    value={editFields.speciality}
                    onChange={(e) => setEditFields({ ...editFields, speciality: e.target.value })}
                />
                <button onClick={handleUpdate}>Update Vet</button>
            </div>


            <div style={{ marginBottom: "20px" }}>
                <h3>Search Veterinarians</h3>
                {conditions.map((cond, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                        {index > 0 && (
                            <strong style={{ marginRight: "8px" }}>{cond.operator}</strong>
                        )}
                        <select value={cond.field}
                            onChange={(e) => updateCondition(index, "field", e.target.value)}>
                            <option value="vet_id">Vet ID</option>
                            <option value="name">Name</option>
                            <option value="clinic">Clinic</option>
                            <option value="speciality">Speciality</option>
                        </select>
                        <span> = </span>
                        <input type="text" placeholder="Value" value={cond.value}
                            onChange={(e) => updateCondition(index, "value", e.target.value)} />
                        {index > 0 && (
                            <button onClick={() => removeCondition(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button onClick={() => addCondition("AND")}>+ AND</button>
                <button onClick={() => addCondition("OR")}>+ OR</button>
                <button onClick={handleSearch} style={{ marginLeft: "16px" }}>Search</button>
                <div style={{ marginTop: "10px" }}>{renderTable(searchResults)}</div>
            </div>


            <div style={{ marginBottom: "20px" }}>
                <h3>Choose Columns to View</h3>
                <p>Check columns to include and use arrows to reorder:</p>
                {ALL_COLUMNS.map(col => (
                    <div key={col} style={{ display: "inline-block", marginRight: "12px" }}>
                        <label>
                            <input type="checkbox"
                                checked={selectedColumns.includes(col)}
                                onChange={() => toggleColumn(col)} />
                            {col}
                        </label>
                    </div>
                ))}
                <div style={{ marginTop: "10px" }}>
                    <p>Column order (use arrows to order):</p>
                    {selectedColumns.map((col, index) => (
                        <span key={col} style={{ marginRight: "8px" }}>
                            {col}
                            <button onClick={() => moveColumn(index, -1)}>←</button>
                            <button onClick={() => moveColumn(index, 1)}>→</button>
                        </span>
                    ))}
                </div>
                <button onClick={handleProject}>Apply</button>
                <div style={{ marginTop: "10px" }}>{renderTable(projectResults)}</div>
            </div>


            <div style={{ marginTop: "20px" }}>
                <h3>All Veterinarians</h3>
                {!rows.length ? <p>No vets found.</p> : (
                    <table border="1" cellPadding="6">
                        <thead>
                            <tr>
                                {Object.keys(rows[0]).map(h => <th key={h}>{h}</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    {Object.keys(rows[0]).map(h => (
                                        <td key={h}>{String(row[h])}</td>
                                    ))}
                                    <td>
                                        <button onClick={() => {
                                            setEditId(row.VET_ID);
                                            setEditFields({
                                                name: row.NAME,
                                                clinic: row.CLINIC,
                                                speciality: row.SPECIALITY
                                            });
                                        }}>Edit</button>
                                        <button onClick={() => handleDelete(row.VET_ID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}