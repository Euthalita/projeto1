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

      {/* rota pública */}
      <Route path="/login" element={<Login />} />

      {/* rota protegida - cadastro */}
      <Route
        path="/cadastro"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <CadastroAluno />
            </>
          </ProtectedRoute>
        }
      />

      {/* rota protegida - chamada facial */}
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

    </Routes>
  );
}