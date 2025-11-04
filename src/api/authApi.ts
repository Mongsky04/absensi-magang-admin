import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";
axios.defaults.withCredentials = true;

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${BASE_URL}/api/admin/auth/login`, { email, password });
  return res.data as { user: { name: string; email: string; role: "user" | "admin" } };
};

export const me = async () => {
  const res = await axios.get(`${BASE_URL}/api/admin/auth/me`);
  return res.data as { user: { name: string; email: string; role: "user" | "admin" } };
};

export const logout = async () => {
  const res = await axios.post(`${BASE_URL}/api/admin/auth/logout`);
  return res.data as { message: string };
};
