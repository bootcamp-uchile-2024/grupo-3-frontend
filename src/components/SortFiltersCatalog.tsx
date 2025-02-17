import '../styles/SortFiltersCatalog.css';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

export interface SortFilter {
    ordenarPor?: string;
    orden?: 'ASC' | 'DESC';
}

interface SortFiltersProps {
    onSortChange: (sortFilter: SortFilter) => void;
}

export const SortFilters: React.FC<SortFiltersProps> = ({ onSortChange }) => {
    const loadSortFiltersFromLocalStorage = () => {
        const storedOrdenarPor = localStorage.getItem('ordenarPor') || undefined;
        const storedOrden = localStorage.getItem('orden') || undefined; 
        return { ordenarPor: storedOrdenarPor, orden: storedOrden as 'ASC' | 'DESC' };
    };

    const [sortFilters, setSortFilters] = useState<SortFilter>(loadSortFiltersFromLocalStorage());
    const [isOpen, setIsOpen] = useState(false); 

    const saveSortFiltersToLocalStorage = (newSortFilters: SortFilter) => {
        if (newSortFilters.ordenarPor) {
            localStorage.setItem('ordenarPor', newSortFilters.ordenarPor);
        } else {
            localStorage.removeItem('ordenarPor');
        }

        if (newSortFilters.orden !== undefined) {
            localStorage.setItem('orden', newSortFilters.orden);
        } else {
            localStorage.removeItem('orden');
        }
    };

    useEffect(() => {
        onSortChange(sortFilters);
    }, [sortFilters, onSortChange]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;

        const newSortFilters: SortFilter = (() => {
            switch (selectedValue) {
                case 'unidadesVendidas':
                    return { ordenarPor: 'unidadesVendidas', orden: 'DESC'};
                case 'puntuacion':
                    return { ordenarPor: 'puntuacion', orden: 'DESC'};
                case 'precio-asc':
                    return { ordenarPor: 'precio', orden: 'ASC' };
                case 'precio-desc':
                    return { ordenarPor: 'precio', orden: 'DESC' };
                default:
                    return { ordenarPor: undefined, orden: undefined }; 
            }
        })();

        setSortFilters(newSortFilters);
        saveSortFiltersToLocalStorage(newSortFilters);
        setIsOpen(false); 
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    return (
        <Row className="mb-3">
            <Col className="mb-4 mt-5 justify-content-start fs-xl colorlet titulopagecatalog">
            <h2 className="text-l-medium mt-4 mb-4">Plantas de interior</h2>
            </Col>
            <Col className="mb-4 mt-5 justify-content-end">
                <div className="custom-select-container colorlet">
                    <select
                        className="custom-select"
                        value={sortFilters.ordenarPor || undefined}
                        onChange={handleSortChange}
                        onFocus={handleFocus}
                    >
                        <option value="">Ordenar por:</option> {/* Opción predeterminada */}
                        <option value="unidadesVendidas">Más vendidos</option>
                        <option value="puntuacion">Mejor valorados</option>
                        <option value="precio-asc">Precio menor a mayor</option>
                        <option value="precio-desc">Precio mayor a menor</option>
                    </select>
                    <span
                        className={`material-symbols-outlined custom-arrow ${isOpen ? 'rotate' : ''}`}
                    >
                        keyboard_arrow_down
                    </span>
                </div>
            </Col>
        </Row>
    );
};