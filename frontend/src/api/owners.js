import api from "./apiBase.js";

export const getOwners = () => api.get("/api/owners");
export const getOneOwner = (id) => api.get(`/api/owners/${id}`);
export const addOwner = (owner) => api.post("/api/owners", owner);
export const updateOwner = (id, owner) => api.put(`/api/owners/${id}`, owner);
export const deleteOwner = (id) => api.delete(`/api/owners/${id}`);
export const getPetsByOwner = (email) => api.get(`/api/owners/pets?email=${email}`);
export const getGreatestAnimalLover = (name) => api.get(`/api/owners/pets/best`);