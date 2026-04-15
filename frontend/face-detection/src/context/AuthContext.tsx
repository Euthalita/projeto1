import { createContext, useContext, useState, useEffect } from "react";

type User = {
  matricula: string;
  role: "STUDENT" | "TEACHER";
};

type LoginResult = {
  success: boolean;
  userExists?: boolean;
  role?: "STUDENT" | "TEACHER";
};

type AuthContextType = {
  user: User | null;
  loginUser: (matricula: string, senha: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // mantém login após refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const loginUser = async (
    matricula: string,
    senha: string
  ): Promise<LoginResult> => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matricula, senha }),
      });

      const data = await response.json();

      // 🔥 esperado do backend:
      // { userExists: boolean, role: "STUDENT" | "TEACHER" }

      if (data.userExists) {
        const userData = {
          matricula,
          role: data.role,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return {
        success: true,
        userExists: data.userExists,
        role: data.role,
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);