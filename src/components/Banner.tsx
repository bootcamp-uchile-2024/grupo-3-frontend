import React from 'react';
import { Container } from 'react-bootstrap';
import SearchBar from './SearchBar';

const Banner: React.FC = () => {
  return (

     <>
      {/* Home Banner */}
      <div className="home-banner d-flex justify-content-center align-items-center">
        <Container className="banner-content text-center">
        <SearchBar />
        </Container>
      </div>

      {/* Banner 1 */}
      <div className="additional-banner home-banner-uno d-flex justify-content-center align-items-center"></div>

      {/* Banner 2 */}
      <div className="additional-banner home-banner-dos d-flex justify-content-center align-items-center"></div>
    </>
  );
};


export default Banner;