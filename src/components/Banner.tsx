import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="container">
      <section id="banner">
        <h2>Traemos la naturaleza a la <br/> puerta de tu casa</h2>
        <button className="btn btn-dark">
          <a href="#">Comprar ahora</a>
        </button>
      </section>
    </div>
  );
};

export default Banner;