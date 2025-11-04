import { useState } from "react";
import { useAuth } from "../AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Gagal login");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl border shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Masuk Admin</h1>
        <label className="text-sm text-gray-600">Email</label>
        <input
          className="mt-1 mb-3 w-full border rounded-lg px-3 py-2 outline-none focus:ring"
          placeholder="email@contoh.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-sm text-gray-600">Password</label>
        <input
          className="mt-1 mb-3 w-full border rounded-lg px-3 py-2 outline-none focus:ring"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading || !email.trim() || !password.trim()}
          className={`w-full py-2 rounded-lg ${loading || !email.trim() || !password.trim() ? "bg-gray-200 text-gray-500" : "bg-blue-700 text-white hover:bg-blue-800"}`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
};

export default Login;
