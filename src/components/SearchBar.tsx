import "../styles/SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="input-wrapper">
          <span className="search-icon">
            <span className="material-symbols-outlined">search</span>
          </span>
          <input 
            placeholder="Busca tu planta" 
            aria-label="Busca tu planta" 
            className="search-input"
          />
{/*           <button type="button" className="camera-button">
            <span className="material-symbols-outlined">photo_camera</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;