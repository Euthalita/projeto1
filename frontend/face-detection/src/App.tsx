import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

import Login from "./pages/Login";
import CadastroAluno from "./pages/CadastroAluno";
import TurmasList from "./pages/TurmasList";
import TurmaForm from "./pages/TurmaForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <h2 className="text-white p-6">Home</h2>
            </>
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/turmas"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <TurmasList />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/turmas/nova"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <TurmaForm />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/turmas/editar/:id"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <TurmaForm />
            </>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
