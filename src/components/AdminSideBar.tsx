import { Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Importar useState para manejar el estado
import '../styles/AdminSideBarStyles.css'; // Asegúrate de importar el archivo CSS

const AdminSideBar = () => {
  const navigate = useNavigate();

  // Estado para el botón seleccionado
  const [selectedButton, setSelectedButtonAdminSideBar] = useState<string | null>(null);

  const buttons = [
    { text: 'Usuarios', icon: 'group', link: '/user-management' },
    { text: 'Productos', icon: 'redeem', link: '/product-management' },
    { text: 'Seguimiento', icon: 'airport_shuttle' },
    { text: 'Métricas', icon: 'graphic_eq' },
    { text: 'Comunidad', icon: 'group_work' },
  ];

  useEffect(() => {
    const savedButton = localStorage.getItem('SelectedButtonAdminSideBar');
    if (savedButton) {
      setSelectedButtonAdminSideBar(savedButton); // Establecemos el botón guardado como seleccionado
    }
  }, []);

  const handleButtonClick = (text: string, link?: string) => {
    setSelectedButtonAdminSideBar(text); 
    localStorage.setItem('SelectedButtonAdminSideBar', text);
    if (link) navigate(link);
  };

  return (
    <Col className="sidebar-col">
      <div className="sidebar-button-container">
        {buttons.map(({ text, icon, link }, index) => (
          <Button
            key={index}
            variant="light"
            className={`sidebar-button ${selectedButton === text ? 'selected' : ''}`}
            onClick={() => handleButtonClick(text, link)}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className='textfontsidebar'>{text}</span>
          </Button>
        ))}
      </div>
    </Col>
  );
};

export default AdminSideBar;