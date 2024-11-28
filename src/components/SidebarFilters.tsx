import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

interface SidebarFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    precio: [0, 100],  // Rango de precio
    tamaño: '',
    disponibilidad: true,
    iluminación: '',
    espacio: '',
    característica: '',
    origen: '',
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLElement>) => {
    const { name, value, type} = event.target as HTMLInputElement | HTMLSelectElement;

    // Verificamos el tipo de elemento y manejamos los diferentes tipos de eventos
    if (type === 'checkbox') {
      setFilters((prev) => {
        const newFilters = { ...prev}; // Usamos `checked` solo si es un checkbox
        onFilterChange(newFilters); // Enviar los nuevos filtros al componente padre
        return newFilters;
      });
    } else if (type === 'range') {
      const [min, max] = value.split(',').map(Number);
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: [min, max] };
        onFilterChange(newFilters);
        return newFilters;
      });
    } else {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };
        onFilterChange(newFilters);
        return newFilters;
      });
    }
  };

  return (
    <div className="sidebar-filters">
      <h3>Filtros</h3>

      {/* Filtro de precio */}
      <Form.Group>
        <Form.Label>Precio</Form.Label>
        <InputGroup>
          <Form.Control
            as="input"
            type="range"
            name="precio"
            min="0"
            max="1000"
            value={filters.precio.join(',')}
            onChange={handleFilterChange}
          />
        </InputGroup>
        <div>
          <span>De ${filters.precio[0]} a ${filters.precio[100000]}</span>
        </div>
      </Form.Group>

      {/* Filtro de tamaño */}
      <Form.Group>
        <Form.Label>Tamaño</Form.Label>
        <Form.Control
          as="select"
          name="tamaño"
          value={filters.tamaño}
          onChange={handleFilterChange}
        >
          <option value="">Seleccionar tamaño</option>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </Form.Control>
      </Form.Group>

      {/* Filtro de disponibilidad */}
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Disponible"
          name="disponibilidad"
          checked={filters.disponibilidad}
          onChange={handleFilterChange}
        />
      </Form.Group>

      {/* Filtro de iluminación */}
      <Form.Group>
        <Form.Label>Iluminación</Form.Label>
        <Form.Control
          as="select"
          name="iluminación"
          value={filters.iluminación}
          onChange={handleFilterChange}
        >
          <option value="">Seleccionar iluminación</option>
          <option value="led">LED</option>
          <option value="incandescente">Incandescente</option>
        </Form.Control>
      </Form.Group>

      {/* Filtro de espacio */}
      <Form.Group>
        <Form.Label>Espacio</Form.Label>
        <Form.Control
          type="text"
          name="espacio"
          value={filters.espacio}
          onChange={handleFilterChange}
        />
      </Form.Group>

      {/* Filtro de característica */}
      <Form.Group>
        <Form.Label>Característica</Form.Label>
        <Form.Control
          type="text"
          name="característica"
          value={filters.característica}
          onChange={handleFilterChange}
        />
      </Form.Group>

      {/* Filtro de origen */}
      <Form.Group>
        <Form.Label>Origen</Form.Label>
        <Form.Control
          as="select"
          name="origen"
          value={filters.origen}
          onChange={handleFilterChange}
        >
          <option value="">Seleccionar origen</option>
          <option value="local">Local</option>
          <option value="importado">Importado</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" onClick={() => onFilterChange(filters)}>
        Aplicar Filtros
      </Button>
    </div>
  );
};

export default SidebarFilters;