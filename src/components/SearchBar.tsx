
import "../styles/SearchBar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container row">
      <div className="search-bar col-xs-12 d-flex justify-content-center">
        <div className="input-wrapper">
          <span
            className="search-icon"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          >
            <span className="material-symbols-outlined">search</span>
          </span>
          <input 
            placeholder="Busca tu planta" 
            aria-label="Busca tu planta" 
            className="search-input"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
/*  

import "../styles/SearchBar.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/productos");
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data); 
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProducts();
  }, []);


  const handleSearch = (term: string) => {
    setSearchTerm(term); 

    if (term === "") {
      setSuggestions([]); 
      return;
    }

    const filtered = products.filter((product: any) =>
      product.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName); 
    setSuggestions([]); 
    navigate(`/catalogo?search=${encodeURIComponent(productName)}`); 
  };

  return (
    <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
  <div className="search-bar">
    <div className="input-wrapper">
      <span
        className="search-icon"
        onClick={handleSearchSubmit}
        style={{ cursor: "pointer" }}
      >
        <span className="material-symbols-outlined">search</span>
      </span>
      <input
        type="text"
        placeholder="Busca tu planta"
        aria-label="Busca tu planta"
        className="search-input"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
      />
    </div>
  </div>

  {suggestions.length > 0 && (
    <ul className="suggestions-list">
      {suggestions.map((product: any) => (
        <li
          key={product.id}
          className="suggestion-item"
          onClick={() => handleSuggestionClick(product.nombre)}
        >
          {product.nombre}
        </li>
      ))}
    </ul>
  )}
</form>

  );
};

export default SearchBar;

*/