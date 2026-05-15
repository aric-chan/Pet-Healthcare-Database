import api from "./apiBase.js";

export const getAppointments = () => api.get("/api/appointments");
export const getAppointmentById = (id) => api.get(`/api/appointments/${id}`);
export const addAppointment = (appointment) => api.post("/api/appointments", appointment);
export const updateAppointment = (id, appointment) => api.put(`/api/appointments/${id}`, appointment);
export const deleteAppointment = (id) => api.delete(`/api/appointments/${id}`);