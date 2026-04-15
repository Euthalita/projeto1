import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import CadastroAluno from "./pages/auth/CadastroAluno";
import FaceDetectorComponent from "./components/FaceDetectorComponent";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

import { startQueueProcessor } from "./api/attendanceEvent";

import StudentHome from "./pages/student/StudentHome";
import TeacherHome from "./pages/teacher/TeacherHome";

import TurmasList from "./pages/teacher/TurmasList";
import TurmaDetalhe from "./pages/teacher/TurmaDetalhe";
import TurmaForm from "./pages/teacher/TurmaForm";

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
  useEffect(() => {
    startQueueProcessor();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/cadastro/:matricula" element={<CadastroAluno />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="STUDENT">
            <Navbar />
            <StudentHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="TEACHER">
            <Navbar />
            <TeacherHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/turmas"
        element={
          <ProtectedRoute role="TEACHER">
            <Navbar />
            <TurmasList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/turmas/nova"
        element={
          <ProtectedRoute role="TEACHER">
            <Navbar />
            <TurmaForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/turmas/editar/:id"
        element={
          <ProtectedRoute role="TEACHER">
            <Navbar />
            <TurmaForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/turmas/:id"
        element={
          <ProtectedRoute role="TEACHER">
            <Navbar />
            <TurmaDetalhe />
          </ProtectedRoute>
        }
      />

      {/* CHAMADA (RECONHECIMENTO) */}
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