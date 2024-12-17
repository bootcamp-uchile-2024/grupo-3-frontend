// SidebarFilters.tsx
import '../styles/SidebarFilters.css';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { CatalogFilters } from '../interfaces/CatalogFilters';

interface SidebarFiltersProps {
  onFilterChange: (filters: CatalogFilters) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ onFilterChange }) => {
  const loadFiltersFromLocalStorage = (): CatalogFilters => {
    const storedFilters = localStorage.getItem('filters');
    return storedFilters ? JSON.parse(storedFilters) : {
      petFriendly: undefined,
      puntuacion: 0,
      maxPrecio: 100000,  
      minPrecio: 1000,
      planta: {    
      idToleranciaTemperatura: 0,
      idIluminacion: 0,
      idTipoRiego: 0,
      },
      ordenarPor: undefined,
      orden: undefined,
    };
  };

  const [filters, setFilters] = useState<CatalogFilters>(loadFiltersFromLocalStorage());

  // Guardar filtros en localStorage cuando cambian
  const saveFiltersToLocalStorage = (newFilters: CatalogFilters) => {
    localStorage.setItem('filters', JSON.stringify(newFilters));
  };

    // Resetear los filtros a su estado inicial y eliminar los datos de localStorage
    const resetFilters = () => {
      const initialFilters = {
        petFriendly: undefined,
        puntuacion: 0,
        maxPrecio: 100000,  
        minPrecio: 1000,
        planta: {    
          idToleranciaTemperatura: 0,
          idIluminacion: 0,
          idTipoRiego: 0,
        },
        ordenarPor: undefined,
        orden: undefined,
      };
  
      setFilters(initialFilters);  
      onFilterChange(initialFilters);  
      localStorage.removeItem('filters'); 
    };

  // Formatear el número en pesos chilenos
  const formatToChileanPesos = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Función para manejar el cambio del precio máximo
  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= filters.minPrecio) {
      const newFilters = { ...filters, maxPrecio: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
      saveFiltersToLocalStorage(newFilters);
    }
  };

  const handlePetFriendlyChange = (value: boolean | undefined) => {
    const newFilters = { ...filters, petFriendly: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    saveFiltersToLocalStorage(newFilters);
  };  

  const handlePlantaChange = (filterName: keyof CatalogFilters['planta'], value: number) => {
    const newFilters = { ...filters, planta: { ...filters.planta, [filterName]: value } };
    setFilters(newFilters);
    onFilterChange(newFilters);
    saveFiltersToLocalStorage(newFilters);
  };

  const handlePuntuacionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const newFilters = { ...filters, puntuacion: value };
    setFilters(newFilters);
    onFilterChange(newFilters); 
    saveFiltersToLocalStorage(newFilters);
  };

  return (
    <div className="mt-4 sidebar-filters fontcolor">
      {/* Filtro de precio */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          <span className='fontfilters'>Precio</span>
          <span className="ms-2">
            {formatToChileanPesos(filters.minPrecio)} - {formatToChileanPesos(filters.maxPrecio)}
          </span>
        </Form.Label>
        
        {/* Barra de precio máximo */}
        <input
          type="range"
          className="form-range"
          min="1000"
          max="100000"
          value={filters.maxPrecio}
          onChange={handleMaxPriceChange}
        />
      </Form.Group>

      {/* Filtro de Puntuación*/}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          <span className='fontfilters'>Puntuación</span>
          <span className="ms-2">{filters.puntuacion} - 5</span>
        </Form.Label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="5"
          value={filters.puntuacion || 0}
          onChange={handlePuntuacionChange} 
        />
      </Form.Group>

      {/* Filtro de iluminación */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Iluminación</Form.Label>
        <Form.Check
          type="checkbox"
          label="Sol Directo"
          checked={filters.planta.idIluminacion === 1}
          onChange={() => handlePlantaChange('idIluminacion', filters.planta.idIluminacion !== 1 ? 1 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Semi Sombra"
          checked={filters.planta.idIluminacion === 2}
          onChange={() => handlePlantaChange('idIluminacion', filters.planta.idIluminacion !== 2 ? 2 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Sombra"
          checked={filters.planta.idIluminacion === 3}
          onChange={() => handlePlantaChange('idIluminacion', filters.planta.idIluminacion !== 3 ? 3 : 0)}
        />
      </Form.Group>

      {/* Filtro de temperatura */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Tolerancia a la Temperatura</Form.Label>
        <Form.Check
          type="checkbox"
          label="Cálido"
          checked={filters.planta.idToleranciaTemperatura === 1}
          onChange={() => handlePlantaChange('idToleranciaTemperatura', filters.planta.idToleranciaTemperatura !== 1 ? 1 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Templado"
          checked={filters.planta.idToleranciaTemperatura === 2}
          onChange={() => handlePlantaChange('idToleranciaTemperatura', filters.planta.idToleranciaTemperatura !== 2 ? 2 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Frío"
          checked={filters.planta.idToleranciaTemperatura === 3}
          onChange={() => handlePlantaChange('idToleranciaTemperatura', filters.planta.idToleranciaTemperatura !== 3 ? 3 : 0)}
        />
      </Form.Group>

      {/* Filtro de tipo de riego */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Tipo de Riego</Form.Label>
        <Form.Check
          type="checkbox"
          label="Manual"
          checked={filters.planta.idTipoRiego === 1}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 1 ? 1 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Goteo"
          checked={filters.planta.idTipoRiego === 2}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 2 ? 2 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Capilar"
          checked={filters.planta.idTipoRiego === 3}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 3 ? 3 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Sumersión"
          checked={filters.planta.idTipoRiego === 4}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 4 ? 4 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Autorriego"
          checked={filters.planta.idTipoRiego === 5}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 5 ? 5 : 0)}
        />
        <Form.Check
          type="checkbox"
          label="Nebulización"
          checked={filters.planta.idTipoRiego === 6}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 6 ? 6 : 0)}
        />
         <Form.Check
          type="checkbox"
          label="Automático"
          checked={filters.planta.idTipoRiego === 7}
          onChange={() => handlePlantaChange('idTipoRiego', filters.planta.idTipoRiego !== 7 ? 7 : 0)}
        />
      </Form.Group>

      {/* Filtro de pet friendly */}
      <Form.Group>
        <Form.Label className='fontfilters'>Pet Friendly</Form.Label>
        <Form.Check
          type="checkbox"
          label="Sí"
          checked={filters.petFriendly === true}
          onChange={() => {if (filters.petFriendly === true) {
            handlePetFriendlyChange(undefined); 
          } else {
            handlePetFriendlyChange(true);
          }
        }}
        />
        <Form.Check
          type="checkbox"
          label="No"
          checked={filters.petFriendly === false}
          onChange={() => {
            if (filters.petFriendly === false) {
              handlePetFriendlyChange(undefined); 
            } else {
              handlePetFriendlyChange(false);
            }
          }}
        />
      </Form.Group>
        {/* Botón para resetear los filtros */}
        <Button variant="primary" className="mb-4 mt-2" onClick={resetFilters}>
        Restablecer Filtros
      </Button>
    </div>
  );
};

export default SidebarFilters;