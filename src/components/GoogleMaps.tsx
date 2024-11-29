import React from "react";

const GoogleMapEmbed = () => {
  return (
    <div style={{ textDecoration: "none", overflow: "hidden", maxWidth: "100%", width: "1326px", height: "280px" }}>
      <div id="google-maps-canvas" style={{ height: "100%", width: "100%", maxWidth: "100%" }}>
        <iframe
          style={{ height: "100%", width: "100%", border: "0" }}
          frameBorder="0"
          src="https://www.google.com/maps/embed/v1/place?q=Las+Hualtatas,+Vitacura,+Chile&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
          allowFullScreen
          title="Google Map"
        ></iframe>
      </div>
      <style>
        {`
          #google-maps-canvas img {
            max-width: none !important;
            background: none !important;
            font-size: inherit;
            font-weight: inherit;
          }
        `}
      </style>
    </div>
  );
};

export default GoogleMapEmbed;
