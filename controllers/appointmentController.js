const { getAllApp, getAppById, insertApp, updateApp, deleteApp } = require("../services/appointmentService");

async function getAll(req, res) {
    try {
        const data = await getAllApp();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getOne(req, res) {
    try {
        const data = await getAppById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Appointment not found." });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    try {
        const { appointment_id, pet_id, vet_id, appt_date, appt_type, notes } = req.body;
        if (!appointment_id || !pet_id || !vet_id || !appt_date || !appt_type) {
            return res.status(400).json({ success: false, message: "Appointment ID, date, type, Pet ID, and Vet ID are required." });
        }
        const result = await insertApp(appointment_id, pet_id, vet_id, appt_date, appt_type, notes);
        if (result) {
            res.json({ success: true, message: "Appointment created successfully." });
        } else {
            res.status(500).json({ success: false, message: "Failed to create appointment." });
        }
    } catch (err) {
        if (err.errorNum === 1) {
            return res.status(400).json({ success: false, message: "Duplicate appointment ID or this vet already has an appointment with this pet on that date." });
        }
        if (err.errorNum === 2291) {
            return res.status(400).json({ success: false, message: "Pet or Vet does not exist." });
        }
        res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    try {
        const { appt_date, appt_type, notes, vet_id, pet_id } = req.body;
        if (!vet_id || !pet_id) {
            return res.status(400).json({ success: false, message: "Vet ID and Pet ID are required." });
        }
        if (!appt_date && !appt_type) {
            return res.status(400).json({ success: false, message: "At least one of appointment date or type is required." });
        }
        const result = await updateApp(req.params.id, appt_date, appt_type, notes, vet_id, pet_id);
        if (result) {
            res.json({ success: true, message: "Appointment updated successfully." });
        } else {
            res.status(404).json({ success: false, message: "Appointment not found." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function remove(req, res) {
    try {
        const result = await deleteApp(req.params.id);
        if (result) {
            res.json({ success: true, message: "Appointment deleted successfully." });
        } else {
            res.status(404).json({ success: false, message: "Appointment not found." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, getOne, create, update, remove };