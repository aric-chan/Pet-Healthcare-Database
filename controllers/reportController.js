const {
    getUpcomingAppointments,
    getVaccineHistory,
    getMonthlyCalories,
    getOwnerSummary,
    getOverdueVaccines,
    getPetOwnerBreed,
    getOwnerAllBreed,
    getActivePets
} = require("../services/reportService");

async function getReport(req, res) {
    try {
        const { type } = req.params;

        let data;

        switch (type) {
            case "upcoming_appointments":
                data = await getUpcomingAppointments(req.query.fromDate);
                break;

            case "vaccine_history":
                data = await getVaccineHistory(req.query.petId);
                break;

            case "monthly_calories":
                data = await getMonthlyCalories();
                break;

            case "owner_summary":
                data = await getOwnerSummary();
                break;

            case "overdue_vaccines":
                data = await getOverdueVaccines(req.query.asOfDate);
                break;

            case "active_pets":
                data = await getActivePets();
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    message: "Unknown report type.",
                });
        }

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

async function divisionPool(req, res) {
    try {
        const data = await getPetOwnerBreed();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function divisionResult(req, res) {
    const {species} = req.query;
    try {
        const data = await getOwnerAllBreed(species);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


module.exports = { getReport, divisionPool, divisionResult};