import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import CadastroAluno from "./pages/CadastroAluno";
import FaceDetectorComponent from "./components/FaceDetectorComponent";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

import { startQueueProcessor } from "./api/attendanceEvent";

// layout reutilizável
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <>
        <Navbar />
        {children}
      </>
    </ProtectedRoute>
  );
}

export default function App() {

  // inicia fila global (ESSENCIAL)
  useEffect(() => {
    startQueueProcessor();
  }, []);

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* CADASTRO */}
      <Route
        path="/cadastro/:matricula"
        element={
          <ProtectedLayout>
            <CadastroAluno />
          </ProtectedLayout>
        }
      />

      {/* CHAMADA (FACE RECOGNITION) */}
      <Route
        path="/chamada"
        element={
          <ProtectedLayout>
            <FaceDetectorComponent />
          </ProtectedLayout>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />

    </Routes>
  );
}