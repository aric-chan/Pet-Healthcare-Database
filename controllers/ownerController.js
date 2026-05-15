const { getAllOwners, getOwnerById, insertOwner, updateOwner, deleteOwner, joinPetsAndOwners, getGreatestAnimalLover } = require("../services/ownerService.js");

async function getAll(req, res) {
    try {
        const data = await getAllOwners();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getOne(req, res) {
    try {
        const data = await getOwnerById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Owner not found." });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function insert(req, res) {
    try {
        const { owner_id, name, address, phone_number, email } = req.body;
        regex = /^\d+$/;
        if (!regex.test(owner_id)) {
            return res.status(400).json({ success: false, message: "Owner ID must be a number." });
        }
        if (!owner_id || !name || !phone_number || !email) {
            return res.status(400).json({ success: false, message: "Owner ID, name, phone number, and email are required." });
        }
        const result = await insertOwner(owner_id, name, address, phone_number, email);
        if (result) {
            res.json({ success: true, message: "Owner added successfully." });
        } else {
            res.status(500).json({ success: false, message: "Failed to add owner." });
        }
    } catch (err) {
        if (err.errorNum === 1) {
            return res.status(400).json({ success: false, message: `This owner (ID: ${req.body.owner_id}) already exists.` });;
        }
        res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    try {
        const { owner_id, name, address, phone_number, email } = req.body;
        if (!owner_id) {
            return res.status(400).json({ success: false, message: "Owner ID is required." });
        }
        if (!name && !address && !phone_number && !email) {
            return res.status(400).json({ success: false, message: "At least one of name, phone number, address or email is required." });
        }
        const result = await updateOwner(owner_id, name, address, phone_number, email);
        if (result) {
            res.json({ success: true, message: "Owner updated successfully." });
        } else {
            res.status(404).json({ success: false, message: "Owner not found." });
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
            return res.status(400).json({ success: false, message: "Owner ID must be a number." });
        }
        const result = await deleteOwner(id);
        if (result) {
            res.json({ success: true, message: "Owner deleted successfully." });
        } else {
            res.status(404).json({ success: false, message: "Owner not found." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function join(req, res) {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: "Fill in Owner email." });
        }
        const data = await joinPetsAndOwners(email);
        if (!data.length) {
            return res.status(404).json({ success: false, message: "No pets found for the owner" });
        }
        res.json({ success: true, data });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function best(req, res) {
    try {
        const data = await getGreatestAnimalLover();
        res.json({ success: true, data });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, getOne, insert, update, remove, join, best };