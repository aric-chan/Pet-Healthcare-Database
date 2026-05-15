import api from "./apiBase.js";

export const getPets = () => api.get("/api/pets");
export const getBreeds = () => api.get("/api/pets/breeds");
export const getOnePet = (id) => api.get(`/api/pets/${id}`);
export const addPet = (pet) => api.post("/api/pets", pet);
export const updatePet = (id, pet) => api.put(`/api/pets/${id}`, pet);
export const deletePet = (id) => api.delete(`/api/pets/${id}`);
export const getDiets = () => api.get("/api/pets/diets");