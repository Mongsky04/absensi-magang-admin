import { createContext, useContext, useEffect, useState } from "react";
import * as Auth from "./api/authApi";

interface User { name: string; email: string; role: "user" | "admin" }
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await Auth.me();
        setUser(res.user as User);
      } catch {}
      finally { setLoading(false); }
    };
    init();
  }, []);

  const doLogin = async (email: string, password: string) => {
    const res = await Auth.login(email, password);
    setUser(res.user as User);
  };

  const doLogout = async () => {
    await Auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: doLogin, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
