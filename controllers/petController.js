const { getAllPets, getPetById, getAllBreeds, getAllDiets, insertPet, updatePet, deletePet } = require("../services/petService.js");

async function getAll(req, res) {
    try {
        const data = await getAllPets();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
async function getAllTypes(req, res) {
    try {
        const data = await getAllBreeds();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getOne(req, res) {
    try {
        const data = await getPetById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Pet not found." });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function insert(req, res) {
    try {
        const { pet_id, owner_id, diet_type, name, breed, birth_date,
            leash_training, favorite_toy,
            indoor_only, litter_box_type,
            habitat_type, diet_preferences } = req.body;
        
        regex = /^\d+$/;
        if (!regex.test(pet_id) || !regex.test(owner_id)) {
            return res.status(400).json({ success: false, message: "Both Pet ID and Owner ID must be numbers." });
        }
        if (!pet_id || !owner_id || !diet_type || !breed) {
            return res.status(400).json({ success: false, message: "Pet ID, Owner ID, Diet, and Breed are required." });
        }
        const result = await insertPet(pet_id, owner_id, diet_type, name, breed, birth_date,
            leash_training, favorite_toy,
            indoor_only, litter_box_type,
            habitat_type, diet_preferences);
        if (result) {
            res.json({ success: true, message: "Pet added successfully." });
        } else {
            res.status(500).json({ success: false, message: "Failed to add pet." });
        }
    } catch (err) {
        if (err.errorNum === 1) {
            return res.status(400).json({ success: false, message: `This pet (ID: ${req.body.pet_id}) already exists.` });
        }
        res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    try {
        const {
            pet_id, owner_id, diet_type, name, breed, birth_date,
            leash_training, favorite_toy,
            indoor_only, litter_box_type,
            habitat_type, diet_preferences
        } = req.body;

        regex = /^\d+$/;
        if (!regex.test(pet_id) || !regex.test(owner_id)) {
            return res.status(400).json({ success: false, message: "Both Pet ID and Owner ID must be numbers." });
        }
        if (!pet_id) {
            return res.status(400).json({ success: false, message: "Pet ID is required." });
        }
        if (!owner_id) {
            return res.status(400).json({ success: false, message: "Owner ID is required." });
        }

        const result = await updatePet(
            Number(pet_id),
            Number(owner_id),
            diet_type,
            name,
            breed,
            birth_date,
            leash_training,
            favorite_toy,
            indoor_only,
            litter_box_type,
            habitat_type,
            diet_preferences
        );

        if (result) {
            res.json({ success: true, message: "Pet updated successfully." });
        } else {
            res.status(404).json({ success: false, message: "Pet not found." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;
        regex = /^\d+$/;
        if (!regex.test(id)) {
            return res.status(400).json({ success: false, message: "Pet ID must be a number." });
        }
        const result = await deletePet(id);
        if (result) {
            res.json({ success: true, message: "Pet deleted successfully." });
        } else {
            res.status(404).json({ success: false, message: "Pet not found." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getAllDietsController(req, res) {
    try {
        const data = await getAllDiets();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, getOne, getAllTypes, getAllDietsController, insert, update, remove };
