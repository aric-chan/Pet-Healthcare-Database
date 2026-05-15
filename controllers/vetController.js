const { getAllVets, getVetById, insertVet, updateVet, deleteVet, searchVets, projectVets } = require("../services/vetService");

async function getAll(req, res) {
    try {
        const rows = await getAllVets();
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getOne(req, res) {
    try {
        const { id } = req.params;
        const row = await getVetById(id);
        if (!row) return res.status(404).json({ success: false, message: 'Vet not found.' });
        res.json({ success: true, data: row });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    try {
        const { vet_id, name, clinic, speciality } = req.body;
        if (!vet_id || !name || !clinic) {
            return res.status(400).json({ success: false, message: 'vet_id, name, and clinic are required.' });
        }
        const result = await insertVet(vet_id, name, clinic, speciality);
        if (result) {
            res.json({ success: true, message: 'Vet created successfully.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to create vet.' });
        }
    } catch (err) {
        if (err.errorNum === 1) {
            return res.status(400).json({ success: false, message: `Vet ID ${req.body.vet_id} already exists.` });
        }
        if (err.errorNum === 2291) {
            return res.status(400).json({ success: false, message: 'Clinic does not exist. Please add the clinic first.' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    try {
        const { name, clinic, speciality } = req.body;
        if (!name && !clinic && !speciality) {
            return res.status(400).json({ success: false, message: "At least one of name, clinic or speciality is required." });
        }
        const result = await updateVet(req.params.id, name, clinic, speciality);
        if (result) {
            res.json({ success: true, message: "Vet updated successfully." });
        } else {
            res.status(404).json({ success: false, message: "Vet not found." });
        }
    } catch (err) {
        //Foreign Key Error Handling
        if (err.message.includes("ORA-02291")) {
            return res.status(400).json({
                success: false,
                message: `The clinic '${req.body.clinic}' does not exist in the database.`
            });
        }

        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteVet(id);
        if (result) {
            res.json({ success: true, message: 'Vet deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Vet not found.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function search(req, res) {
    try {
        const { conditions } = req.body;
        if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({ success: false, message: "At least one condition is required." });
        }
        const data = await searchVets(conditions);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function project(req, res) {
    try {
        const { columns } = req.body;
        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            return res.status(400).json({ success: false, message: "At least one column is required." });
        }
        const data = await projectVets(columns);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, getOne, create, update, remove, search, project };