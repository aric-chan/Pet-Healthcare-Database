import { useEffect, useState } from "react";
import {
  getPets,
  getBreeds,
  getDiets,
  addPet,
  updatePet,
  deletePet,
} from "../api/pets.js";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [message, setMessage] = useState("");
  const [petsError, setPetsError] = useState("");
  const [breedsError, setBreedsError] = useState("");
  const [actionError, setActionError] = useState("");
  const [diets, setDiets] = useState([]);
  const [dietsError, setDietsError] = useState("");

  const [newPet, setNewPet] = useState({
    pet_id: "",
    owner_id: "",
    diet_type: "",
    name: "",
    breed: "",
    birth_date: "",
    leash_training: "",
    favorite_toy: "",
    indoor_only: "",
    litter_box_type: "",
    habitat_type: "",
    diet_preferences: ""
  });


  const [updateData, setUpdateData] = useState({
    pet_id: "",
    owner_id: "",
    diet_type: "",
    name: "",
    breed: "",
    birth_date: "",
    leash_training: "",
    favorite_toy: "",
    indoor_only: "",
    litter_box_type: "",
    habitat_type: "",
    diet_preferences: ""
  });

  const [deleteId, setDeleteId] = useState("");

  async function loadPets() {
    try {
        setPetsError("");
        const res = await getPets();
        console.log("Loaded pets:", res.data.data);
        setPets(res.data.data ?? res.data);
    } catch (err) {
        console.error(err);
        setPetsError("Failed to load pets.");
    }
  }

  async function loadDiets() {
    try {
        setDietsError("");
        const res = await getDiets();
        setDiets(res.data.data ?? res.data);
        console.log("Loaded diets:", res.data.data);
    } catch (err) {
        console.error(err);
        setDietsError("Failed to load diets.");
    }
  }

  async function loadBreeds() {
    try {
        setBreedsError("");
        const res = await getBreeds();
        console.log("Loaded breeds:", res.data.data);
        setBreeds(res.data.data ?? res.data);
    } catch (err) {
        console.error(err);
        setBreedsError("Failed to load breeds.");
    }
  }

  useEffect(() => {
    loadPets();
    loadBreeds();
    loadDiets();
  }, []);

  function handleNewPetChange(e) {
    const { name, value } = e.target;
    setNewPet((prev) => ({
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

  async function handleAddPet(e) {
    e.preventDefault();
    try {
      setMessage("");
      setActionError("");

      await addPet({
        pet_id: newPet.pet_id,
        owner_id: newPet.owner_id,
        diet_type: newPet.diet_type,
        name: newPet.name,
        breed: newPet.breed,
        birth_date: newPet.birth_date,
        leash_training: newPet.leash_training,
        favorite_toy: newPet.favorite_toy,
        indoor_only: newPet.indoor_only,
        litter_box_type: newPet.litter_box_type,
        habitat_type: newPet.habitat_type,
        diet_preferences: newPet.diet_preferences,
      });

      setMessage("Pet added successfully.");
      setNewPet({
        pet_id: "",
        owner_id: "",
        diet_type: "",
        name: "",
        breed: "",
        birth_date: "",
        leash_training: "",
        favorite_toy: "",
        indoor_only: "",
        litter_box_type: "",
        habitat_type: "",
        diet_preferences: ""
      });

      loadPets();
    } catch (err) {
      console.error(err);
      setActionError("Failed to add pet.");
    }
  }

  async function handleUpdatePet(e) {
    e.preventDefault();
    try {
      setMessage("");
      setActionError("");

      await updatePet(updateData.pet_id, {
        pet_id: updateData.pet_id,
        owner_id: updateData.owner_id,
        diet_type: updateData.diet_type,
        name: updateData.name,
        breed: updateData.breed,
        birth_date: updateData.birth_date,
        leash_training: updateData.leash_training,
        favorite_toy: updateData.favorite_toy,
        indoor_only: updateData.indoor_only,
        litter_box_type: updateData.litter_box_type,
        habitat_type: updateData.habitat_type,
        diet_preferences: updateData.diet_preferences,
      });

      setMessage("Pet updated successfully.");
      setUpdateData({
        pet_id: "",
        owner_id: "",
        diet_type: "",
        name: "",
        breed: "",
        birth_date: "",
        leash_training: "",
        favorite_toy: "",
        indoor_only: "",
        litter_box_type: "",
        habitat_type: "",
        diet_preferences: ""
      });

      loadPets();
    } catch (err) {
      console.error(err.response?.data || err);
      setActionError(err.response?.data?.message || "Failed to update pet.");
    }
  }

  async function handleDeletePet(e) {
    e.preventDefault();
    try {
      setMessage("");
      setActionError("");

      await deletePet(deleteId);

      setMessage("Pet deleted successfully.");
      setDeleteId("");
      window.dispatchEvent(new Event("appointments-refresh"));
      loadPets();
    } catch (err) {
      console.error(err.response?.data || err);
      setActionError(err.response?.data?.message || "Failed to delete pet.");
    }
  }

  return (
    <div>
      <h2>Pets</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {petsError && <p style={{ color: "red" }}>{petsError}</p>}
      {breedsError && <p style={{ color: "red" }}>{breedsError}</p>}
      {dietsError && <p style={{ color: "red" }}>{dietsError}</p>}
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>PET_ID</th>
            <th>OWNER_ID</th>
            <th>NAME</th>
            <th>BREED</th>
            <th>BIRTHDATE</th>
            {/* TODO: below info should change depending on breed? some type of join will be needed */}
            <th>MORE INFO</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.PET_ID ?? pet.pet_id}>
              <td>{pet.PET_ID ?? pet.pet_id}</td>
              <td>{pet.OWNER_ID ?? pet.owner_id}</td>
              <td>{pet.NAME ?? pet.name}</td>
              <td>{pet.BREED ?? pet.breed}</td>
              <td>{pet.BIRTH_DATE ?? pet.birth_date}</td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <hr />
      <br />

    <h3>Add Pet</h3>
    <form onSubmit={handleAddPet}>
        <input
            name="pet_id"
            placeholder="Pet ID"
            value={newPet.pet_id}
            onChange={handleNewPetChange}
            required
        />
        <input
            name="owner_id"
            placeholder="Owner ID"
            value={newPet.owner_id}
            onChange={handleNewPetChange}
            required
        />
        <select
                name="diet_type"
                value={newPet.diet_type}
                onChange={handleNewPetChange}
                required
            >
                <option value="">Select diet</option>
                {diets.map((d) => (
                    <option key={d.DIET_TYPE ?? d.diet_type} value={d.DIET_TYPE ?? d.diet_type}>
                    {d.DIET_TYPE ?? d.diet_type}
                    </option>
                ))}
            </select>
        <input
            name="name"
            placeholder="Name"
            value={newPet.name}
            onChange={handleNewPetChange}
            required
        />
        <select
            name="breed"
            value={newPet.breed}
            onChange={handleNewPetChange}
            required
        >
            <option value="">Select breed</option>
            {breeds.map((b) => (
                <option key={b.BREED ?? b.breed} value={b.BREED ?? b.breed}>
                    {(b.BREED ?? b.breed)} ({(b.SPECIES ?? b.species)})
                </option>
            ))}
        </select>
        <input
            type="date"
            name="birth_date"
            value={newPet.birth_date}
            onChange={handleNewPetChange}
        />
        <button type="submit">Add Pet</button>
    </form>

      <br />
      <hr />
      <br />

      <h3>Update Pet</h3>
        <form onSubmit={handleUpdatePet}>
            <input
                name="pet_id"
                placeholder="Pet ID to update"
                value={updateData.pet_id}
                onChange={handleUpdateChange}
                required
            />
            <input
                name="owner_id"
                placeholder="Owner ID"
                value={updateData.owner_id}
                onChange={handleUpdateChange}
            />
            <select
                name="diet_type"
                value={updateData.diet_type}
                onChange={handleUpdateChange}
                required
            >
                <option value="">Select diet</option>
                {diets.map((d) => (
                    <option key={d.DIET_TYPE ?? d.diet_type} value={d.DIET_TYPE ?? d.diet_type}>
                    {d.DIET_TYPE ?? d.diet_type}
                    </option>
                ))}
            </select>
            <input
                name="name"
                placeholder="Name"
                value={updateData.name}
                onChange={handleUpdateChange}
            />
            <select
                name="breed"
                value={updateData.breed}
                onChange={handleUpdateChange}
            >
                <option value="">Select breed</option>
                {breeds.map((b) => (
                    <option key={b.BREED ?? b.breed} value={b.BREED ?? b.breed}>
                        {(b.BREED ?? b.breed)} ({(b.SPECIES ?? b.species)})
                    </option>
                ))}
            </select>
            <input
                type="date"
                name="birth_date"
                value={updateData.birth_date}
                onChange={handleUpdateChange}
            />
            <button type="submit">Update Pet</button>
        </form>

      <br />
      <hr />
      <br />

      <h3>Delete Pet</h3>
      <form onSubmit={handleDeletePet}>
        <input
          placeholder="Pet ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          required
        />
        <button type="submit">Delete Pet</button>
      </form>
    </div>
  );
}