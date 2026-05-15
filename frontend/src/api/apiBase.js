import axios from "axios";

const apiBase = axios.create({
  // NOTE: port matches the local tunneling to backend server
  baseURL: "http://localhost:55001",
  timeout: 5000,
});

export default apiBase;