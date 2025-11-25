import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

import Login from "./pages/Login";
import CadastroAluno from "./pages/CadastroAluno";
import TurmasList from "./pages/TurmasList";
import TurmaForm from "./pages/TurmaForm";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
            <ProtectedRoute>
              <h2>Home</h2>
            </ProtectedRoute>
          } 
        />

        <Route path="/cadastro/:matricula" element={
            <ProtectedRoute>
              <CadastroAluno />
            </ProtectedRoute>
          } 
        />

        <Route path="/turmas" element={
            <ProtectedRoute>
              <TurmasList />
            </ProtectedRoute>
          } 
        />

        <Route path="/turmas/nova" element={
            <ProtectedRoute>
              <TurmaForm />
            </ProtectedRoute>
          } 
        />

        <Route path="/turmas/editar/:id" element={
            <ProtectedRoute>
              <TurmaForm />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
