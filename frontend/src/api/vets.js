import api from "./apiBase.js";

export const getVets = () => api.get("/api/veterinarians");
export const getVetById = (id) => api.get(`/api/veterinarians/${id}`);
export const addVet = (vet) => api.post("/api/veterinarians", vet);
export const updateVet = (id, vet) => api.put(`/api/veterinarians/${id}`, vet);
export const deleteVet = (id) => api.delete(`/api/veterinarians/${id}`);
export const searchVets = (conditions) => api.post("/api/veterinarians/search", { conditions });
export const projectVets = (columns) => api.post("/api/veterinarians/project", { columns });