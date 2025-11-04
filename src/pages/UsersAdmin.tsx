import { useEffect, useState } from "react";
import type { UserItem } from "../api/usersApi";
import { listUsers, createUser, updateUser, resetPassword, deleteUser } from "../api/usersApi";
import { useAuth } from "../AuthContext";

const UsersAdmin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" as "user" | "admin" });
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal memuat user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") refresh();
  }, [user?.role]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const payload: any = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      if (form.role) payload.role = form.role;
      const res = await createUser(payload);
      await refresh();
      const tempInfo = res.tempPassword ? `\nPassword sementara: ${res.tempPassword}` : "";
      alert(`User berhasil dibuat.${tempInfo}`);
      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Gagal membuat user");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (u: UserItem) => {
    try {
      await updateUser(u.id, { active: !u.active });
      await refresh();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Gagal memperbarui status");
    }
  };

  const doResetPassword = async (u: UserItem) => {
    try {
      const res = await resetPassword(u.id);
      const msg = res.tempPassword ? `Password sementara: ${res.tempPassword}` : res.message;
      alert(msg);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Gagal reset password");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manajemen User</h1>
      </div>

      {/* Create form */}
      <form onSubmit={onCreate} className="bg-white rounded-xl shadow p-4 mb-6 grid gap-3 sm:grid-cols-4">
        <input
          required
          placeholder="Nama"
          className="border rounded-lg px-3 py-2"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="border rounded-lg px-3 py-2"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          placeholder="Password (opsional)"
          className="border rounded-lg px-3 py-2"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <select
          className="border rounded-lg px-3 py-2"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as any }))}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="sm:col-span-4 bg-blue-700 text-white rounded-lg py-2 hover:bg-blue-800 disabled:opacity-60"
          disabled={creating}
        >
          {creating ? "Membuat..." : "Buat User"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow p-4">
        {loading && <p className="text-sm text-gray-600">Memuat...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={async (e) => {
                      try {
                        await updateUser(u.id, { role: e.target.value as any });
                        await refresh();
                      } catch (err: any) {
                        alert(err?.response?.data?.message || err?.message || "Gagal mengubah role");
                      }
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2">
                  <span className={u.active ? "text-green-700" : "text-gray-500"}>
                    {u.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => toggleActive(u)}
                    className="px-2 py-1 rounded border hover:bg-gray-50"
                  >
                    {u.active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    onClick={() => doResetPassword(u)}
                    className="px-2 py-1 rounded border hover:bg-gray-50"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={async () => {
                      if (user?.email === u.email) {
                        alert("Tidak dapat menghapus akun sendiri");
                        return;
                      }
                      if (!confirm(`Hapus user ${u.email}?`)) return;
                      try {
                        await deleteUser(u.id);
                        await refresh();
                      } catch (e: any) {
                        alert(e?.response?.data?.message || e?.message || "Gagal menghapus user");
                      }
                    }}
                    className="px-2 py-1 rounded border hover:bg-red-50 text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersAdmin;
