const oracledb = require("oracledb");
const { withOracleDB } = require("./db");

async function getAllApp() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Appointment ORDER BY appt_date`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

async function getAppById(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Appointment WHERE appointment_id = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0] || null;
    });
}

async function insertApp(appointment_id, pet_id, vet_id, appt_date, appt_type, notes) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Appointment (appointment_id, pet_id, vet_id, appt_date, appt_type, notes)
             VALUES (:appointment_id, :pet_id, :vet_id, 
                     TO_DATE(:appt_date, 'YYYY-MM-DD'), :appt_type, :notes)`,
            { appointment_id, pet_id, vet_id, appt_date, appt_type, notes: notes || null },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function updateApp(id, appt_date, appt_type, notes, vet_id, pet_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Appointment 
             SET appt_date = TO_DATE(:appt_date, 'YYYY-MM-DD'),
                 appt_type = :appt_type,
                 notes = :notes,
                 vet_id = :vet_id,
                 pet_id = :pet_id
             WHERE appointment_id = :id`,
            { id, appt_date, appt_type, notes: notes || null, vet_id, pet_id },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function deleteApp(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Appointment WHERE appointment_id = :id',
            [id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}


module.exports = { getAllApp, getAppById, insertApp, updateApp, deleteApp };