import { createContext, useContext, useState} from "react";
import type { ReactNode } from 'react';
import { api } from "../api/api";

interface AuthContextProps {
  user: string | null;
  loginUser: (matricula: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

interface AuthProviderProps {
  children: ReactNode; // tipagem correta do children
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("user") || null;
  });

  const loginUser = async (matricula: string, senha: string) => {
    try {
      const response = await api.post(
        "/auth/api/login",
        { matricula, senha },
        { responseType: "text" } // backend retorna texto
      );

      console.log("Resposta backend:", response.data);

      // aqui você só tem o texto, então vamos guardar a matrícula manualmente
      if (response.status === 200) {
        setUser(matricula);
        localStorage.setItem("user", matricula);
        return true;
      }

      return false;
    } catch (err: any) {
      console.error("Erro login:", err.response?.data || err.message);
      return false;
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
