import React from 'react';

const PlantCareTips: React.FC = () => {
  return (
    <div>
      <h2 className="center">Cuidados para tus plantas</h2>
      {/* Sección Tips */}
      <section id="tips">
        <div className="tip">
          <div className="img-tip"></div>
          <h3>Guía de cuidados</h3>
          <p>Learn the best watering practices</p>
        </div>
        <div className="tip">
          <div className="img-tip"></div>
          <h3>Guía de cuidados</h3>
          <p>Learn the best watering practices</p>
        </div>
      </section>
    </div>
  );
};

export default PlantCareTips;
