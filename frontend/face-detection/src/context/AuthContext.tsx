import { createContext, useContext, useState, useEffect } from "react";

// 🔥 User agora tem temCadastro
type User = {
  email: string;
  role: "STUDENT" | "TEACHER";
  temCadastro: boolean;
};

type LoginResult = {
  success: boolean;
  role?: string;
  temCadastro?: boolean;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  loginUser: (email: string, senha: string) => Promise<LoginResult>;
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
    email: string,
    senha: string
  ): Promise<LoginResult> => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        let message = "Erro no login";

        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          if (response.status === 401) {
            message = "Senha inválida";
          } else if (response.status === 404) {
            message = "Aluno não encontrado no SIGA";
          }
        }

        return {
          success: false,
          message,
        };
      }

      const data = await response.json();

      // monta usuário corretamente
      const userData: User = {
        email: data.email,
        role: data.role,
        temCadastro: data.temCadastro,
      };

      // salva SEMPRE (independente de ter cadastro ou não)
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        success: true,
        role: data.role,
        temCadastro: data.temCadastro,
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
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