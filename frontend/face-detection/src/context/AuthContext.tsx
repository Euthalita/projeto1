import { createContext, useContext, useState } from "react";
import { login } from "../api/authService";

interface AuthContextType {
  matricula: string | null;
  loginUser: (matricula: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [matricula, setMatricula] = useState<string | null>(null);

  const loginUser = async (matriculaInput: string, senha: string) => {
    try {
      const response = await login({ matricula: matriculaInput, senha });

      // exemplo de retorno:
      // "Login realizado com sucesso! Matrícula: 123456"
      const match = response.match(/Matrícula:\s*(\w+)/);

      if (match) {
        setMatricula(match[1]);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  const logout = () => setMatricula(null);

  return (
    <AuthContext.Provider value={{ matricula, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro do <AuthProvider>. Verifique se o AuthProvider está envolvendo seu App."
    );
  }
  return context;
};
