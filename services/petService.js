const oracledb = require("oracledb");
const { withOracleDB } = require("./db");

async function getAllPets() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Pet ORDER BY pet_id`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

async function getAllBreeds() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Breed ORDER BY breed`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

async function getPetById(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Pet WHERE pet_id = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0] || null;
    });
}

async function insertPet(pet_id, owner_id, diet_type, name, breed, birth_date,
    leash_training, favorite_toy,
    indoor_only, litter_box_type,
    habitat_type, diet_preferences) {
    let result;
    return await withOracleDB(async (connection) => {
        try {
            result = await connection.execute(
                `INSERT INTO Pet (pet_id, owner_id, diet_type, name, breed, birth_date)
                 VALUES (:pet_id, :owner_id, :diet_type, 
                        :name, :breed, TO_DATE(:birth_date, 'YYYY-MM-DD'))`,
                { pet_id, owner_id, diet_type, name: name || null, breed, birth_date: birth_date || null },
                { autoCommit: false }
            );
            const species = await checkSpecies(connection, breed);
            if (species == "Dog") {
                await insertDog(connection, pet_id, leash_training, favorite_toy);
            } else if (species == "Cat") {
                await insertCat(connection, pet_id, indoor_only, litter_box_type);
            } else {
                await insertOtherPet(connection, pet_id, habitat_type, diet_preferences);
            }
            await connection.commit();
        } catch (err) {
            // want to rollback if only one of the inserts fail, otherwise we could end up with a pet but no ISA record
            await connection.rollback();
            throw err;
        }
        return result.rowsAffected && result.rowsAffected > 0;
    });
}
async function checkSpecies(connection, breed) {
    const check_species = await connection.execute(
        `SELECT b.species
         FROM Breed b
         WHERE b.breed = :breed`,
        { breed }
    );
    return check_species.rows[0][0];
}


async function insertDog(connection, pet_id, leash_training, favorite_toy) {
    return await connection.execute(
        `INSERT INTO Dog (pet_id, leash_training, favorite_toy)
         VALUES (:pet_id, :leash_training, :favorite_toy)`,
        { pet_id, leash_training: leash_training || null, favorite_toy: favorite_toy || null },
        { autoCommit: false }
    );
}

async function insertCat(connection, pet_id, indoor_only, litter_box_type) {
    return await connection.execute(
        `INSERT INTO Cat (pet_id, indoor_only, litter_box_type)
         VALUES (:pet_id, :indoor_only, :litter_box_type)`,
        { pet_id, indoor_only: indoor_only || null, litter_box_type: litter_box_type || null },
        { autoCommit: false }
    );
}

async function insertOtherPet(connection, pet_id, habitat_type, diet_preferences) {
    return await connection.execute(
        `INSERT INTO OtherPet (pet_id, habitat_type, diet_preferences)
         VALUES (:pet_id, :habitat_type, :diet_preferences)`,
        { pet_id, habitat_type: habitat_type || null, diet_preferences: diet_preferences || null },
        { autoCommit: false }
    );
}

async function updatePet(pet_id, owner_id, diet_type, name, breed, birth_date,
    leash_training, favorite_toy,
    indoor_only, litter_box_type,
    habitat_type, diet_preferences) {
    let result;
    return await withOracleDB(async (connection) => {
        try {
            result = await connection.execute(
                `UPDATE Pet
                 SET owner_id = :owner_id,
                    diet_type = :diet_type,
                    name = :name,
                    breed = :breed,
                    birth_date = TO_DATE(:birth_date, 'YYYY-MM-DD')
                WHERE pet_id = :pet_id`,
                {
                    pet_id,
                    owner_id,
                    diet_type,
                    name: name || null,
                    breed,
                    birth_date
                },
                { autoCommit: false }
            );
            const species = await checkSpecies(connection, breed);
            if (species == "Dog") {
                await updateDog(connection, pet_id, leash_training, favorite_toy);
            } else if (species == "Cat") {
                await updateCat(connection, pet_id, indoor_only, litter_box_type);
            } else {
                await updateOtherPet(connection, pet_id, habitat_type, diet_preferences);
            }
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        }

        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function updateDog(connection, pet_id, leash_training, favorite_toy) {
    return await connection.execute(
        `UPDATE Dog
         SET leash_training = COALESCE(:leash_training, leash_training),
             favorite_toy = COALESCE(:favorite_toy, favorite_toy)
         WHERE pet_id = :pet_id`,
        {
            pet_id,
            leash_training: leash_training || null,
            favorite_toy: favorite_toy || null
        },
        { autoCommit: false }
    );
}

async function updateCat(connection, pet_id, indoor_only, litter_box_type) {
    return await connection.execute(
        `UPDATE Cat
         SET indoor_only = COALESCE(:indoor_only, indoor_only),
             litter_box_type = COALESCE(:litter_box_type, litter_box_type)
         WHERE pet_id = :pet_id`,
        {
            pet_id,
            indoor_only: indoor_only || null,
            litter_box_type: litter_box_type || null
        },
        { autoCommit: false }
    );
}

async function updateOtherPet(connection, pet_id, habitat_type, diet_preferences) {
    return await connection.execute(
        `UPDATE OtherPet
         SET habitat_type = COALESCE(:habitat_type, habitat_type),
             diet_preferences = COALESCE(:diet_preferences, diet_preferences)
         WHERE pet_id = :pet_id`,
        {
            pet_id,
            habitat_type: habitat_type || null,
            diet_preferences: diet_preferences || null
        },
        { autoCommit: false }
    );
}

async function deletePet(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Pet WHERE pet_id = :id',
            [id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    });
}

async function getAllDiets() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Diet ORDER BY diet_type`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    });
}

module.exports = { getAllPets, getPetById, getAllBreeds, insertPet, insertDog, insertCat, insertOtherPet,
    updatePet, updateDog, updateCat, updateOtherPet, deletePet, getAllDiets };