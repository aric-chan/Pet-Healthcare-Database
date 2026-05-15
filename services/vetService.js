const oracledb = require("oracledb");
const { withOracleDB } = require("./db");

async function getAllVets() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT vet_id, name, clinic, speciality 
             FROM Veterinarian 
             ORDER BY vet_id`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

async function getVetById(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT vet_id, name, clinic, speciality 
             FROM Veterinarian 
             WHERE vet_id = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0] || null;
    });
}

async function insertVet(vet_id, name, clinic, speciality) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Veterinarian (vet_id, name, clinic, speciality)
             VALUES (:vet_id, :name, :clinic, :speciality)`,
            { vet_id, name, clinic, speciality: speciality || null },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function updateVet(id, name, clinic, speciality) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Veterinarian 
             SET name = :name,
                 clinic = :clinic,
                 speciality = :speciality
             WHERE vet_id = :id`,
            { id, name, clinic, speciality: speciality || null },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function deleteVet(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Veterinarian WHERE vet_id = :id`,
            { id },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function searchVets(conditions) {
    return await withOracleDB(async (connection) => {

        if (conditions.length === 0) return [];

        const allowedFields = ['vet_id', 'name', 'clinic', 'speciality'];
        const whereClauses = [];
        const binds = {};

        conditions.forEach((cond, index) => {
            if (!allowedFields.includes(cond.field)) return; // sanitize field name to prevent SQL injection
            const bindKey = `val${index}`;
            whereClauses.push({
                clause: `${cond.field} = :${bindKey}`,
                operator: cond.operator,
                bindKey
            });
            binds[bindKey] = cond.value;
        });

        if (whereClauses.length === 0) return [];

        // build WHERE string: first clause has no operator prefix
        // so it has whereClauses[0].clause and then concatenate the rest
        let whereStr = whereClauses[0].clause;
        for (let i = 1; i < whereClauses.length; i++) {
            whereStr += ` ${whereClauses[i].operator} ${whereClauses[i].clause}`;
        }

        const result = await connection.execute(
            `SELECT * FROM Veterinarian WHERE ${whereStr}`,
            binds,
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

async function projectVets(columns) {
    return await withOracleDB(async (connection) => {
        const allowedFields = ['vet_id', 'name', 'clinic', 'speciality'];

        const safeColumns = columns.filter(col => allowedFields.includes(col));
        if (safeColumns.length === 0) return [];

        const result = await connection.execute(
            `SELECT ${safeColumns.join(', ')} FROM Veterinarian`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

module.exports = { getAllVets, getVetById, insertVet, updateVet, deleteVet, searchVets, projectVets };