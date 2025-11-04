import { AuthProvider, useAuth } from "./AuthContext";
import UsersAdmin from "./pages/UsersAdmin";
import Login from "./pages/Login";

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, loading, logout } = useAuth();
  if (loading) return <div className="p-6">Memuat...</div>;
  if (!user) return <Login />;
  if (user.role !== "admin") return <div className="p-6">Akses ditolak.</div>;
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">A</div>
            <span className="text-xl font-bold text-blue-700">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{user.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
              title="Logout"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
      <UsersAdmin />
    </div>
  );
};

export default App;
