import '../styles/SidebarFilters.css'
import React from 'react';
import { Form } from 'react-bootstrap';

interface SidebarFiltersProps {
  onFilterChange: () => void; }

  const SidebarFilters: React.FC<SidebarFiltersProps> = ({ onFilterChange })  => {
    console.log (onFilterChange)

  return (
    <div className="mt-4 sidebar-filters fontcolor">
      {/* Filtro de precio */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          <span className='fontfilters'>Precio</span>
          <span className="ms-2">10.000 - 100.000</span>
        </Form.Label>
        <input type="range" className="form-range" min="10000" max="100000"/>
      </Form.Group>
  
      {/* Filtro de tamaño */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          <span className='fontfilters'> Tamaño </span>
          <span className="ms-2">60 - 150 cm</span>
        </Form.Label>
        <input type="range" className="form-range" min="60" max="150"/>
      </Form.Group>
  
      {/* Filtro de disponibilidad */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Disponibilidad</Form.Label>
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
        <Form.Label className='fontfilters'>Iluminación</Form.Label>
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
        <Form.Label className='fontfilters'>Espacio</Form.Label>
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
        <Form.Label className='fontfilters'>Característica</Form.Label>
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
        <Form.Label className='fontfilters'>Origen</Form.Label>
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