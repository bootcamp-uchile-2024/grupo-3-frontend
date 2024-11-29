import React /*{ useState }*/ from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface SidebarFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = (/*{ onFilterChange }*/) => {
  /*const [, setFilters] = useState({
    precio: [0, 10000],  // Rango de precio
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
        const newFilters = { ...prev};
        onFilterChange(newFilters); 
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
  };*/

  return (
    <div className="sidebar-filters">
      {/* Filtro de precio */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          Precio
          <span className="ms-2">10.000 - 100.000</span>
        </Form.Label>
        <InputGroup>
          <Form.Control
            as="input"
            type="range"
            name="precio"
            min="0"
            max="10000"
          />
        </InputGroup>
      </Form.Group>
  
      {/* Filtro de tamaño */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          Tamaño
          <span className="ms-2">60 - 150 cm</span>
        </Form.Label>
        <InputGroup>
          <Form.Control
            as="input"
            type="range"
            name="precio"
            min="60"
            max="150"
          />
        </InputGroup>
      </Form.Group>
  
      {/* Filtro de disponibilidad */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label>Disponibilidad</Form.Label>
        <Form.Check
          type="checkbox"
          label="Disponible"
          name="disponibilidad"
        />
        <Form.Check
          type="checkbox"
          label="Agotado"
          name="disponibilidad"
        />
      </Form.Group>
  
      {/* Filtro de iluminación */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label>Iluminación</Form.Label>
        <Form.Check
          type="checkbox"
          label="Sol Directo"
          name="Sol Directo"
        />
        <Form.Check
          type="checkbox"
          label="Semi Sombra"
          name="Semi Sombra"
        />
        <Form.Check
          type="checkbox"
          label="Sombra"
          name="Sombra"
        />
      </Form.Group>
  
      {/* Filtro de espacio */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label>Espacio</Form.Label>
        <Form.Check
          type="checkbox"
          label="Baño"
          name="Baño"
        />
        <Form.Check
          type="checkbox"
          label="Cocina"
          name="Cocina"
        />
        <Form.Check
          type="checkbox"
          label="Living"
          name="Living"
        />
        <Form.Check
          type="checkbox"
          label="Pieza"
          name="Pieza"
        />
        <Form.Check
          type="checkbox"
          label="Pasillo"
          name="Pasillo"
        />
        <Form.Check
          type="checkbox"
          label="Terraza"
          name="Terraza"
        />
      </Form.Group>
  
      {/* Filtro de característica */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label>Característica</Form.Label>
        <Form.Check
          type="checkbox"
          label="Hoja Chica"
          name="Hoja Chica"
        />
        <Form.Check
          type="checkbox"
          label="Hoja Grande"
          name="Hoja Grande"
        />
        <Form.Check
          type="checkbox"
          label="Bajo Mantenimiento"
          name="Bajo Mantenimiento"
        />
        <Form.Check
          type="checkbox"
          label="Resistente"
          name="Resistente"
        />
        <Form.Check
          type="checkbox"
          label="Con Flor"
          name="Con Flor"
        />
        <Form.Check
          type="checkbox"
          label="Palmera"
          name="Palmera"
        />
      </Form.Group>
  
      {/* Filtro de origen */}
      <Form.Group>
        <Form.Label>Origen</Form.Label>
        <Form.Check
          type="checkbox"
          label="Nacional"
          name="Nacional"
        />
        <Form.Check
          type="checkbox"
          label="Extranjero"
          name="Extranjero"
        />
      </Form.Group>
    </div>
  );
};  

export default SidebarFilters;