import { Routes, Route } from "react-router-dom";

import CadastroAluno from "./pages/CadastroAluno";
import FaceDetectorComponent from "./components/FaceDetectorComponent";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* CADASTRO COM PARAMETRO */}
      <Route
        path="/cadastro/:matricula"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <CadastroAluno />
            </>
          </ProtectedRoute>
        }
      />

      {/* CHAMADA */}
      <Route
        path="/chamada"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <FaceDetectorComponent />
            </>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK (evita tela preta) */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />

    </Routes>
  );
}