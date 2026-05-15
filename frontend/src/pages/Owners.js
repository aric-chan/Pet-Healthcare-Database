import { useEffect, useState } from "react";
import {
  getOwners,
  getOneOwner,
  addOwner,
  updateOwner,
  deleteOwner,
  getPetsByOwner,
  getGreatestAnimalLover,
} from "../api/owners.js";

export default function Owners() {
  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [newOwner, setNewOwner] = useState({
    owner_id: "",
    name: "",
    address: "",
    phone_number: "",
    email: "",
  });

  const [updateData, setUpdateData] = useState({
    id: "",
    name: "",
    address: "",
    phone_number: "",
    email: "",
  });

  const [deleteId, setDeleteId] = useState("");

  const [searchEmail, setSearchEmail] = useState("");
  const [joinResults, setJoinResults] = useState([]);

  async function loadOwners() {
    try {
      setError("");
      const res = await getOwners();
      setOwners(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load owners.");
    }
  }

  useEffect(() => {
    loadOwners();
  }, []);

  function handleNewOwnerChange(e) {
    const { name, value } = e.target;
    setNewOwner((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleUpdateChange(e) {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddOwner(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      await addOwner({
        owner_id: newOwner.owner_id,
        name: newOwner.name,
        address: newOwner.address || null,
        phone_number: newOwner.phone_number,
        email: newOwner.email,
      });

      setMessage("Owner added successfully.");
      setNewOwner({
        owner_id: "",
        name: "",
        address: "",
        phone_number: "",
        email: "",
      });

      loadOwners();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add owner.");
    }
  }

  async function handleUpdateOwner(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      await updateOwner(updateData.id, {
        owner_id: Number(updateData.id),
        name: updateData.name || null,
        address: updateData.address || null,
        phone_number: updateData.phone_number || null,
        email: updateData.email || null,
      });

      setMessage("Owner updated successfully.");
      setUpdateData({
        id: "",
        name: "",
        address: "",
        phone_number: "",
        email: "",
      });

      loadOwners();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update owner.");
    }
  }

  async function handleDeleteOwner(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      await deleteOwner(deleteId);

      setMessage("Owner deleted successfully.");
      setDeleteId("");
      loadOwners();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete owner.");
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      const res = await getPetsByOwner(searchEmail);
      setJoinResults(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No pets found for this owner.");
    }
  }

  return (
    <div>
      <h2>Owners</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>OWNER_ID</th>
            <th>NAME</th>
            <th>ADDRESS</th>
            <th>PHONE_NUMBER</th>
            <th>EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.OWNER_ID ?? owner.owner_id}>
              <td>{owner.OWNER_ID ?? owner.owner_id}</td>
              <td>{owner.NAME ?? owner.name}</td>
              <td>{owner.ADDRESS ?? owner.address}</td>
              <td>{owner.PHONE_NUMBER ?? owner.phone_number}</td>
              <td>{owner.EMAIL ?? owner.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={async () => {
          try {
            setMessage("");
            setError("");
            const res = await getGreatestAnimalLover();
            console.log("Greatest animal lover response:", res);
            const allOwners = res.data.data;
            const allOwnersInfo = {};

            for (let i = 0; i < allOwners.length; i++) {
              const currId = allOwners[i][0];

              const currRes = await getOneOwner(currId);
              const currOwnerInfo = currRes.data.data;

              allOwnersInfo[currOwnerInfo.OWNER_ID] = currOwnerInfo.NAME;
              console.log("Curr owner info:", currOwnerInfo);
            }
            if (Object.keys(allOwnersInfo).length > 0) {
              setMessage(
                `Owner(s) with the most pets: ${Object.entries(allOwnersInfo)
                  .map(([id, name]) => `${name} (ID: ${id})`)
                  .join(", ")}`
              );
            } else {
              setMessage("No owners found.");
            }
          } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch owner with most pets.");
          }
        }}
      >
        Who has the most pets?
      </button>

      <br />
      <hr />
      <br />

      <h3>Add Owner</h3>
      <form onSubmit={handleAddOwner}>
        <input
          name="owner_id"
          placeholder="Owner ID"
          value={newOwner.owner_id}
          onChange={handleNewOwnerChange}
          required
        />
        <input
          name="name"
          placeholder="Name"
          value={newOwner.name}
          onChange={handleNewOwnerChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={newOwner.address}
          onChange={handleNewOwnerChange}
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          value={newOwner.phone_number}
          onChange={handleNewOwnerChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={newOwner.email}
          onChange={handleNewOwnerChange}
          required
        />
        <button type="submit">Add Owner</button>
      </form>

      <br />
      <hr />
      <br />

      <h3>Update Owner</h3>
      <form onSubmit={handleUpdateOwner}>
        <input
          name="id"
          placeholder="Owner ID to update"
          value={updateData.id}
          onChange={handleUpdateChange}
          required
        />
        <input
          name="name"
          placeholder="New Name"
          value={updateData.name}
          onChange={handleUpdateChange}
        />
        <input
          name="address"
          placeholder="New Address"
          value={updateData.address}
          onChange={handleUpdateChange}
        />
        <input
          name="phone_number"
          placeholder="New Phone Number"
          value={updateData.phone_number}
          onChange={handleUpdateChange}
        />
        <input
          name="email"
          placeholder="New Email"
          value={updateData.email}
          onChange={handleUpdateChange}
        />
        <button type="submit">Update Owner</button>
      </form>

      <br />
      <hr />
      <br />

      <h3>Delete Owner</h3>
      <form onSubmit={handleDeleteOwner}>
        <input
          placeholder="Owner ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          required
        />
        <button type="submit">Delete Owner</button>
      </form>


      <h3>Find Pets by Owner Email</h3>
      <form onSubmit={handleJoin}>
        <input
          placeholder="Enter owner email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {joinResults.length > 0 && (
        <table border="1" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>OWNER_ID</th>
              <th>OWNER_NAME</th>
              <th>EMAIL</th>
              <th>PHONE_NUMBER</th>
              <th>PET_ID</th>
              <th>PET_NAME</th>
              <th>BREED</th>
              <th>BIRTH_DATE</th>
            </tr>
          </thead>
          <tbody>
            {joinResults.map((row, index) => (
              <tr key={index}>
                <td>{row.OWNER_ID}</td>
                <td>{row.OWNER_NAME}</td>
                <td>{row.EMAIL}</td>
                <td>{row.PHONE_NUMBER}</td>
                <td>{row.PET_ID}</td>
                <td>{row.PET_NAME}</td>
                <td>{row.BREED}</td>
                <td>{String(row.BIRTH_DATE)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}