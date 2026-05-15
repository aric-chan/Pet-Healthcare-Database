const oracledb = require("oracledb");
const { withOracleDB } = require("./db");

async function getUpcomingAppointments(fromDate) {
    return await withOracleDB(async (connection) => {
        let sql = `
            SELECT
                a.appointment_id,
                a.appt_date,
                a.appt_type,
                a.notes,
                p.pet_id,
                p.name AS pet_name,
                v.vet_id,
                v.name AS vet_name,
                v.clinic
            FROM Appointment a
            JOIN Pet p ON a.pet_id = p.pet_id
            JOIN Veterinarian v ON a.vet_id = v.vet_id
        `;

        const binds = {};
        if (fromDate) {
            sql += ` WHERE a.appt_date >= TO_DATE(:fromDate, 'YYYY-MM-DD') `;
            binds.fromDate = fromDate;
        }

        sql += ` ORDER BY a.appt_date, p.name `;

        const result = await connection.execute(sql, binds, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        return result.rows;
    });
}

async function getVaccineHistory(petId) {
    return await withOracleDB(async (connection) => {
        let sql = `
            SELECT
                pv.pet_id,
                p.name AS pet_name,
                pv.vaccine_name,
                pv.manufacturer,
                pv.vaccination_date,
                pv.next_due_date,
                v.target_species,
                v.prescription
            FROM PetVaccine pv
            JOIN Pet p
                ON pv.pet_id = p.pet_id
            JOIN Vaccine v
                ON pv.vaccine_name = v.vaccine_name
               AND pv.manufacturer = v.manufacturer
        `;

        const binds = {};
        if (petId) {
            sql += ` WHERE pv.pet_id = :petId `;
            binds.petId = Number(petId);
        }

        sql += ` ORDER BY p.name, pv.vaccination_date DESC `;

        const result = await connection.execute(sql, binds, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        return result.rows;
    });
}

async function getMonthlyCalories() {
    return await withOracleDB(async (connection) => {
        const sql = `
            SELECT
                pa.pet_id,
                p.name AS pet_name,
                TO_CHAR(pa.activity_date, 'YYYY-MM') AS activity_month,
                SUM(ac.calories_burnt) AS total_calories,
                COUNT(*) AS activity_count
            FROM PetActivity pa
            JOIN Pet p
                ON pa.pet_id = p.pet_id
            JOIN Activity a
                ON pa.activity_name = a.activity_name
            JOIN Activity_Calories ac
                ON a.activity_type = ac.activity_type
               AND a.duration_min = ac.duration_min
            GROUP BY pa.pet_id, p.name, TO_CHAR(pa.activity_date, 'YYYY-MM')
            ORDER BY activity_month, pet_name
        `;

        const result = await connection.execute(sql, {}, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        return result.rows;
    });
}

async function getOwnerSummary() {
    return await withOracleDB(async (connection) => {
        const sql = `
            SELECT
                o.owner_id,
                o.name AS owner_name,
                COUNT(DISTINCT p.pet_id) AS pet_count,
                COUNT(DISTINCT a.appointment_id) AS appointment_count,
                COUNT(DISTINCT
                    pv.pet_id || '-' || pv.vaccine_name || '-' || pv.manufacturer || '-' || TO_CHAR(pv.vaccination_date, 'YYYY-MM-DD')
                ) AS vaccine_record_count
            FROM Owner o
            LEFT JOIN Pet p
                ON o.owner_id = p.owner_id
            LEFT JOIN Appointment a
                ON p.pet_id = a.pet_id
            LEFT JOIN PetVaccine pv
                ON p.pet_id = pv.pet_id
            GROUP BY o.owner_id, o.name
            ORDER BY pet_count DESC, owner_name
        `;

        const result = await connection.execute(sql, {}, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        return result.rows;
    });
}

async function getOverdueVaccines(asOfDate) {
    return await withOracleDB(async (connection) => {
        let sql = `
            SELECT
                pv.pet_id,
                p.name AS pet_name,
                pv.vaccine_name,
                pv.manufacturer,
                pv.next_due_date
            FROM PetVaccine pv
            JOIN Pet p
                ON pv.pet_id = p.pet_id
        `;

        const binds = {};
        if (asOfDate) {
            sql += ` WHERE pv.next_due_date < TO_DATE(:asOfDate, 'YYYY-MM-DD') `;
            binds.asOfDate = asOfDate;
        } else {
            sql += ` WHERE pv.next_due_date < TRUNC(SYSDATE) `;
        }

        sql += ` ORDER BY pv.next_due_date `;

        const result = await connection.execute(sql, binds, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        return result.rows;
    });
}

async function getPetOwnerBreed () {
    return await withOracleDB(async (connection) => {
        const sql = `
                SELECT 
                    O.name AS owner_name, 
                    P.name AS pet_name, 
                    B.species, 
                    B.breed
                FROM Owner O
                JOIN Pet P ON O.owner_id = P.owner_id
                JOIN Breed B ON P.breed = B.breed
                ORDER BY O.name
        `;
        const result = await connection.execute(sql, {}, { 
            outFormat: oracledb.OUT_FORMAT_OBJECT 
        });
        return result.rows;
    });
}

async function getOwnerAllBreed (species) {
    return await withOracleDB(async (connection) => {
        const sql = `
                SELECT O.owner_id, O.name, O.email
                FROM Owner O
                WHERE NOT EXISTS (
                    (SELECT B.breed FROM Breed B WHERE B.species = :sp)
                    MINUS
                    (SELECT P.breed FROM Pet P WHERE P.owner_id = O.owner_id)
                )
        `;
        const result = await connection.execute(sql, {sp: species}, { 
            outFormat: oracledb.OUT_FORMAT_OBJECT 
        });
        return result.rows;
    });
}
async function getActivePets() {
    return await withOracleDB(async (connection) => {
        const sql = `
            SELECT
                p.pet_id,
                p.name AS pet_name,
                COUNT(pa.activity_name) AS activity_count
            FROM Pet p
            JOIN PetActivity pa
                ON p.pet_id = pa.pet_id
            GROUP BY p.pet_id, p.name
            HAVING COUNT(pa.activity_name) >= 2
            ORDER BY activity_count DESC, pet_name
        `;

        const result = await connection.execute(sql, {}, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        return result.rows;
    });
}

module.exports = {
    getUpcomingAppointments,
    getVaccineHistory,
    getMonthlyCalories,
    getOwnerSummary,
    getOverdueVaccines,
    getPetOwnerBreed,
    getOwnerAllBreed,
    getActivePets
};