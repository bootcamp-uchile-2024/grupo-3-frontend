// SearchBar.tsx

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
    <div className="search-bar-container">
      <div className="search-bar">
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
