import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { login } from "../api/authService";
import { Menubar } from 'primereact/menubar';
import { useState } from 'react';

export const Navbar = () => {
  const auth = useAuth();
  const matricula = auth?.user;

  // Itens do menu
  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      to: '/',
    },
    {
      label: 'Turmas',
      icon: 'pi pi-users',
      to: '/turmas',
    }
  ];

  // Função de logout
  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="navbar-container relative">
      <Menubar 
        model={items.map(item => ({
          ...item,
          command: () => window.location.href = item.to,
        }))} 
        style={{ backgroundColor: '#1f2937', color: '#fffefeff', padding: '0.5rem' }}
      />
      {matricula && (
        <div className="absolute top-3 right-3">
          <Button 
            label="Sair" 
            icon="pi pi-sign-out" 
            className="p-button-danger p-button-outlined" 
            onClick={handleLogout} 
          />
        </div>
      )}
    </div>
  );
};
