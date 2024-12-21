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
    if (!storedFilters) return getDefaultFilters();

    try {
      const parsedFilters = JSON.parse(storedFilters);
      return parsedFilters;
    } catch (e) {
      return getDefaultFilters();
    }
  };

  const getDefaultFilters = (): CatalogFilters => ({
    petFriendly: undefined,
    puntuacion: 0,
    maxPrecio: 100000,
    minPrecio: 1000,
    planta: {
      idToleranciaTemperatura: 0,
      idIluminacion: 0,
      idTipoRiego: 0,
      idTamano: 0,
    },
    ordenarPor: undefined,
    orden: undefined,
    page: 0,
    pageSize: 0
  });

  const [filters, setFilters] = useState<CatalogFilters>(loadFiltersFromLocalStorage());

  const saveFiltersToLocalStorage = (newFilters: CatalogFilters) => {
    localStorage.setItem('filters', JSON.stringify(newFilters));
  };

  const updateFilters = (newFilters: CatalogFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
    saveFiltersToLocalStorage(newFilters);
  };

  const resetFilters = () => {
    const initialFilters = getDefaultFilters();
    updateFilters(initialFilters);
    localStorage.removeItem('filters');
  };

  const formatToChileanPesos = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= (filters.minPrecio ?? 0)) { 
      updateFilters({ ...filters, maxPrecio: value });
    }
  };

  const handlePetFriendlyChange = (value: boolean | undefined) => {
    updateFilters({ ...filters, petFriendly: value });
  };

  const handlePlantaChange = (filterName: keyof CatalogFilters['planta'], value: number) => {
    updateFilters({
      ...filters,
      planta: { ...filters.planta, [filterName]: value },
    });
  };

  const handleCheckboxChange = (filterName: keyof CatalogFilters['planta'], value: number) => {
    const currentValue = filters.planta[filterName];
    const newValue = currentValue !== value ? value : 0;
    handlePlantaChange(filterName, newValue);
  };

  const handlePetFriendlyToggle = () => {
    const newValue = filters.petFriendly === true ? undefined : true;
    handlePetFriendlyChange(newValue);
  };

  return (
    <div className="mt-4 sidebar-filters fontcolor">
      {/* Botón para resetear los filtros */}
      <Button variant="primary" className="mb-4 mt-2" onClick={resetFilters}>
        Restablecer Filtros
      </Button>

      {/* Filtro de precio */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          <span className='fontfilters'>Precio</span>
          <span className="ms-2">
            {formatToChileanPesos(filters.minPrecio ?? 0)} - {formatToChileanPesos(filters.maxPrecio ?? 100000)}
          </span>

        </Form.Label>
        <input
          type="range"
          className="form-range"
          min="1000"
          max="100000"
          value={filters.maxPrecio}
          onChange={handleMaxPriceChange}
        />
      </Form.Group>

      {/* Filtro de Tamaño */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className="d-flex justify-content-between align-items-center">
          <span className='fontfilters'>Tamaño</span>
        </Form.Label>
        {['S', 'M', 'L', 'XL'].map((size, index) => (
          <Form.Check
            key={size}
            type="checkbox"
            label={size}
            checked={filters.planta.idTamano === index + 1}
            onChange={() => handleCheckboxChange('idTamano', index + 1)}
          />
        ))}
      </Form.Group>

      {/* Filtro de iluminación */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Iluminación</Form.Label>
        {['Sol Directo', 'Semi Sombra', 'Sombra'].map((label, index) => (
          <Form.Check
            key={label}
            type="checkbox"
            label={label}
            checked={filters.planta.idIluminacion === index + 1}
            onChange={() => handleCheckboxChange('idIluminacion', index + 1)}
          />
        ))}
      </Form.Group>

      {/* Filtro de temperatura */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Tolerancia a la Temperatura</Form.Label>
        {['Cálido', 'Templado', 'Frío'].map((label, index) => (
          <Form.Check
            key={label}
            type="checkbox"
            label={label}
            checked={filters.planta.idToleranciaTemperatura === index + 1}
            onChange={() => handleCheckboxChange('idToleranciaTemperatura', index + 1)}
          />
        ))}
      </Form.Group>

      {/* Filtro de tipo de riego */}
      <Form.Group className="border-bottom mb-3 pb-3">
        <Form.Label className='fontfilters'>Tipo de Riego</Form.Label>
        {['Manual', 'Goteo', 'Capilar', 'Sumersión', 'Autorriego', 'Nebulización', 'Automático'].map((label, index) => (
          <Form.Check
            key={label}
            type="checkbox"
            label={label}
            checked={filters.planta.idTipoRiego === index + 1}
            onChange={() => handleCheckboxChange('idTipoRiego', index + 1)}
          />
        ))}
      </Form.Group>

      {/* Filtro de pet friendly */}
      <Form.Group>
        <Form.Label className='fontfilters'>Pet Friendly</Form.Label>
        <Form.Check
          type="checkbox"
          label="Mostrar"
          checked={filters.petFriendly === true}
          onChange={handlePetFriendlyToggle}
        />
      </Form.Group>
    </div>
  );
};

export default SidebarFilters;