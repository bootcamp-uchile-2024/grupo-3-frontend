import '../styles/GoogleMapEmbed.css';

const GoogleMapEmbed = () => {
  return (
    <div className="google-maps-container">
      <h2 className="map-title text-l-medium text-start">Encuéntranos aquí</h2>
      <div id="google-maps-canvas" className="map-canvas">
        <iframe
          className="map-iframe"
          frameBorder="0"
          src="https://www.google.com/maps/embed/v1/place?q=Las+Hualtatas,+Vitacura,+Chile&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
          allowFullScreen
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleMapEmbed;