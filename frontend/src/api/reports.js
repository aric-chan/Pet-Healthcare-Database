import api from "./apiBase.js";

export const getOwnerSummary = () => api.get("/api/reports/owner_summary");
export const getMonthlyCalories = () => api.get("/api/reports/monthly_calories");
export const getUpcomingAppointments = () => api.get("/api/reports/upcoming_appointments");
export const getOverdueVaccines = () => api.get("/api/reports/overdue_vaccines");
export const getVaccineHistory = (petId) =>
    api.get(`/api/reports/vaccine_history?petId=${petId}`);

export const getDivisionPool = () =>  api.get(`/api/reports/division/pool`);
export const getDivisionResult = (species) => 
    api.get(`/api/reports/division/result`, {
        params: { species } 
    });
export const getActivePets = () =>
    api.get("/api/reports/active_pets");