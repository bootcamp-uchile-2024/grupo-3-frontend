import React from 'react';
import { Container } from 'react-bootstrap';
import SearchBar from './SearchBar';

const Banner: React.FC = () => {
  return (

     <>
      {/* Home Banner */}
      <div className="home-banner">
        <Container className="banner-content text-center">
        <SearchBar />
        </Container>
      </div>

      {/* Banner 1 */}
      <div className="additional-banner home-banner-uno"></div>

      {/* Banner 2 */}
      <div className="additional-banner home-banner-dos"></div>
    </>
  );
};


export default Banner;