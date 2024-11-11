import { useEffect, useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.example.com/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);  
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
        method: 'DELETE', 
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      const data = await response.json();

      console.log('Usuario eliminado:', data);
      
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.username})
              <button onClick={() => deleteUser(user.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;

