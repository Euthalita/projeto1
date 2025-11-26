import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { Menubar } from 'primereact/menubar';

export const Navbar = () => {
  const auth = useAuth();
  const matricula = auth?.user;

  const items = [
    { label: 'Home', icon: 'pi pi-home', to: '/' },
    { label: 'Turmas', icon: 'pi pi-users', to: '/turmas' },
  ];

  return (
    <div className="w-full">
      <Menubar
        model={items.map(item => ({
          ...item,
          command: () => (window.location.href = item.to),
        }))}

        style={{ backgroundColor: '#120f24ff', padding: "0.8rem", borderRadius: 0 }}

        end={
          matricula ? (
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              className="p-button-danger p-button-outlined"
              onClick={auth.logout}
            />
          ) : null
        }
      />
    </div>
  );
};
