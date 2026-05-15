const oracledb = require("oracledb");
const { withOracleDB } = require("./db");

async function getAllOwners() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Owner ORDER BY owner_id`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

async function getOwnerById(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Owner WHERE owner_id = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0] || null;
    });
}

async function insertOwner(owner_id, name, address, phone_number, email) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Owner (owner_id, name, address, phone_number, email)
             VALUES (:owner_id, :name, :address, 
                    :phone_number, :email)`,
            { owner_id, name, address: address || null, phone_number, email },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function updateOwner(owner_id, name, address, phone_number, email) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Owner 
              SET name = COALESCE(:name, name),
                 address = COALESCE(:address, address),
                 phone_number = COALESCE(:phone_number, phone_number),
                 email = COALESCE(:email, email)
             WHERE owner_id = :owner_id`,
            { owner_id, name, address, phone_number, email },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function deleteOwner(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Owner WHERE owner_id = :id',
            [id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function getGreatestAnimalLover() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT P.owner_id \
            FROM Pet P \
            GROUP BY P.owner_id \
            HAVING COUNT(*) >= ALL (SELECT COUNT(*) \
                                    FROM Pet P2 \
                                    GROUP BY P2.owner_id)',
            {},
            { autoCommit: true }
        );
        return result.rows;
    });
}

async function joinPetsAndOwners(email) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT o.owner_id, o.name AS owner_name, o.email, o.phone_number,
                    p.pet_id, p.name AS pet_name, p.breed, p.birth_date
             FROM Owner o
             JOIN Pet p ON o.owner_id = p.owner_id
             WHERE o.email = :email`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}



module.exports = { getAllOwners, getOwnerById, insertOwner, updateOwner, deleteOwner, getGreatestAnimalLover, joinPetsAndOwners };