import axios from "axios";

// One shared axios instance for every API call.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Send cookies with each request: the backend keeps the refresh token in an httpOnly cookie
  withCredentials: true,
  timeout: 10_000,
});

export default api;
