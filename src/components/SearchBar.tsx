import { InputGroup, FormControl, Button } from "react-bootstrap";
import "../styles/SearchBar.css"; 

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <InputGroup className="search-bar">
        <InputGroup.Text className="search-icon">
          <span className="material-symbols-outlined">search</span>
        </InputGroup.Text>
        <FormControl
          placeholder="Busca tu planta"
          aria-label="Busca tu planta"
          className="search-input"
        />
        <Button variant="outline-secondary" className="camera-button">
          <span className="material-symbols-outlined">photo_camera</span>
        </Button>
      </InputGroup>
    </div>
  );
};

export default SearchBar;
