import React from 'react';

const Reviews: React.FC = () => {
  return (
    <div>
      <h2 className="center">Reseñas de usuarios</h2>
      {/* Sección Reviews */}
      <section id="reviews">
        <div className="review">
          <div className="user-avatar">
            {/* Puedes agregar contenido aquí si es necesario */}
          </div>
          <div className="review-content">
            <h3>Usuario 1</h3>
            <p>Amazing product and fast delivery!</p>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>
        <div className="review">
          <div className="user-avatar">
            {/* Puedes agregar contenido aquí si es necesario */}
          </div>
          <div className="review-content">
            <h3>Usuario 1</h3>
            <p>Amazing product and fast delivery!</p>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-o"></i>
            </div>
          </div>
        </div>
        <div className="review">
          <div className="user-avatar">
            {/* Puedes agregar contenido aquí si es necesario */}
          </div>
          <div className="review-content">
            <h3>Usuario 1</h3>
            <p>Amazing product and fast delivery!</p>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>
        <div className="review">
          <div className="user-avatar">
            {/* Puedes agregar contenido aquí si es necesario */}
          </div>
          <div className="review-content">
            <h3>Usuario 1</h3>
            <p>Amazing product and fast delivery!</p>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-o"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
