import React, { useEffect, useState } from 'react';

interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
}
interface Carrito {
  id: number;
  idUsuario: number;
  precioTotal: number;
  totalProductos: number;
  productos: Producto[];
}
interface CarritoResponse {
  id: string;
  idUsuario: number;
  precioTotal: number;
  carroProductos: {
    producto: {
      nombre: string;
      precio: number;
    };
    cantidadProducto: number;
  }[];
}

const AdminCartPage: React.FC = () => {
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const [searchCartId, setSearchCartId] = useState<number | null>(null);
  const [searchedCartData, setSearchedCartData] = useState<Carrito | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const carritoIds = [1, 2, 3, 4, 5, 6, 7, 17]; // IDs manuales

  const fetchCarritoById = async (id: number): Promise<Carrito | null> => {
    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: CarritoResponse = await response.json();
      return {
        id: data.id,
        idUsuario: data.idUsuario,
        precioTotal: data.precioTotal,
        totalProductos: data.carroProductos.length,
        productos: data.carroProductos.map((p: any) => ({
          nombre: p.producto.nombre,
          cantidad: p.cantidadProducto,
          precio: p.producto.precio,
        })),
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error al obtener el carrito con ID ${id}:`, err.message);
        return null;
      }
    };

    const fetchCarritos = async () => {
      setLoading(true);
      setError(null);

      try {
        const carritosData = await Promise.all(
          carritoIds.map((id) => fetchCarritoById(id))
        );

        setCarritos(carritosData.filter((carrito) => carrito !== null));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const searchCarritoById = async () => {
      if (!searchCartId) {
        alert('Por favor, ingresa un ID válido.');
        return;
      }

      setSearchLoading(true);
      setSearchError(null);

      try {
        const data = await fetchCarritoById(searchCartId);
        if (!data) {
          throw new Error('Carrito no encontrado.');
        }
        setSearchedCartData(data);
      } catch (err) {
        if (err instanceof Error) {
          setSearchError(err.message);
        }
        setSearchedCartData(null);
      } finally {
        setSearchLoading(false);
      }
    };

    const checkCarritoActivo = async (userId: number) => {
      try {
        const response = await fetch(`http://localhost:8080/carro-compras/activo/${userId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.status === 404) {
          return false;
        }

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        return true;
      } catch (err) {
        console.error(`Error al verificar carrito activo para el usuario ${userId}:`, err.message);
        return false;
      }
    };

    const createCarrito = async (): Promise<void> => {
      if (!newUserId) {
        alert('Por favor, ingresa un ID de usuario válido.');
        return;
      }

      setCreating(true);
      try {
        const carritoActivo = await checkCarritoActivo(newUserId);
        if (carritoActivo) {
          alert('Este usuario ya tiene un carrito activo. Elimínalo primero.');
          return;
        }

        const response = await fetch(`http://localhost:8080/carro-compras/${newUserId}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const nuevoCarrito = await response.json();
        alert('Carrito creado con éxito.');

        const carrito = {
          id: nuevoCarrito.id || 'N/A',
          idUsuario: nuevoCarrito.idUsuario || newUserId,
          precioTotal: nuevoCarrito.precioTotal || 0,
          totalProductos: nuevoCarrito.carroProductos ? nuevoCarrito.carroProductos.length : 0,
          productos: nuevoCarrito.carroProductos
            ? nuevoCarrito.carroProductos.map((p) => ({
              nombre: p.producto.nombre,
              cantidad: p.cantidadProducto,
              precio: p.producto.precio,
            }))
            : [],
        };

        setCarritos((prevCarritos) => [...prevCarritos, carrito]);
      } catch (err) {
        alert(`Error al crear el carrito: ${err.message}`);
      } finally {
        setCreating(false);
      }
    };

    const deleteCarrito = async (carritoId: number) => {
      if (!window.confirm(`¿Estás seguro de que deseas eliminar el carrito con ID ${carritoId}?`)) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/carro-compras/${carritoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        alert('Carrito eliminado con éxito.');
        setCarritos((prevCarritos) => prevCarritos.filter((carrito) => carrito.id !== carritoId));
      } catch (err) {
        if (err instanceof Error) {
          alert(`Error al eliminar el carrito: ${err.message}`);
        }
      }
    };

    useEffect(() => {
      fetchCarritos();
    }, []);

    return (
      <div className="container mt-4">
        <h2>Gestión de Carritos</h2>

        <div className="mt-4">
          <h4>Buscar Carrito por ID</h4>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Ingresa el ID del carrito"
              value={searchCartId || ''}
              onChange={(e) => setSearchCartId(Number(e.target.value))}
            />
            <button
              className="btn btn-primary"
              onClick={searchCarritoById}
              disabled={searchLoading}
            >
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {searchError && <p className="text-danger">Error: {searchError}</p>}
          {searchedCartData && (
            <div>
              <h5>Carrito ID: {searchedCartData.id}</h5>
              <p>Total: ${searchedCartData.precioTotal}</p>
              <ul>
                {searchedCartData.productos.map((producto: any, index: number) => (
                  <li key={index}>
                    {producto.nombre} - {producto.cantidad} unidad(es) - ${producto.precio}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {loading ? (
          <p>Cargando carritos...</p>
        ) : error ? (
          <p className="text-danger">Error: {error}</p>
        ) : (
          <>
            <table className="table table-striped mt-4">
              <thead>
                <tr>
                  <th>ID Carrito</th>
                  <th>Usuario</th>
                  <th>Total Productos</th>
                  <th>Precio Total</th>
                  <th>Detalles</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carritos.map((carrito) => (
                  <tr key={carrito.id}>
                    <td>{carrito.id}</td>
                    <td>{carrito.idUsuario}</td>
                    <td>{carrito.totalProductos}</td>
                    <td>${carrito.precioTotal}</td>
                    <td>
                      <ul>
                        {carrito.productos.map((producto: Producto, index: number) => (
                          <li key={index}>
                            {producto.nombre} - {producto.cantidad} unidad(es) - ${producto.precio}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => deleteCarrito(carrito.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Editar carrito con ID: ${carrito.id}`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <h3>Crear Nuevo Carrito</h3>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="ID de Usuario"
                  value={newUserId || ''}
                  onChange={(e) => setNewUserId(Number(e.target.value))}
                  disabled={creating}
                />
                <button
                  className="btn btn-primary"
                  onClick={createCarrito}
                  disabled={creating}
                >
                  {creating ? 'Creando...' : 'Crear Carrito'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
};

export default AdminCartPage;
