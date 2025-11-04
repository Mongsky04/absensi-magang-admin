import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";
axios.defaults.withCredentials = true;
const API = `${BASE_URL}/api/admin/users`;

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  active: boolean;
  createdAt?: string;
};

export const listUsers = async (): Promise<UserItem[]> => {
  const res = await axios.get(API);
  return res.data as UserItem[];
};

export const createUser = async (payload: { name: string; email: string; password?: string; role?: "user" | "admin" }) => {
  const res = await axios.post(API, payload);
  return res.data as { id: string; name: string; email: string; role: "user" | "admin"; active: boolean; tempPassword?: string };
};

export const updateUser = async (id: string, payload: Partial<{ name: string; email: string; role: "user" | "admin"; active: boolean }>) => {
  const res = await axios.patch(`${API}/${id}`, payload);
  return res.data as UserItem;
};

export const resetPassword = async (id: string, newPassword?: string) => {
  const res = await axios.post(`${API}/${id}/reset-password`, newPassword ? { newPassword } : {});
  return res.data as { message: string; tempPassword?: string };
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data as { message: string };
};
