import React from "react";

const CardProducts: React.FC = () => {
    return (
        <div className="container">
            <h2 className="center">Plantas para llevar a tu hogar</h2>
            <section id="productos">
                <div className="product d-flex flex-column align-items-center">
                    <div className="product-image"></div>
                    <h3 className="text-center">Ficus</h3>
                    <p>$20.000</p>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-dark">
                            <a href="#" className="text-white">Comprar</a>
                        </button>
                    </div>
                </div>
                <div className="product d-flex flex-column align-items-center">
                    <div className="product-image"></div>
                    <h3 className="text-center">Ficus</h3>
                    <p>$20.000</p>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-dark">
                            <a href="#" className="text-white">Comprar</a>
                        </button>
                    </div>
                </div>
                <div className="product d-flex flex-column align-items-center">
                    <div className="product-image"></div>
                    <h3 className="text-center">Ficus</h3>
                    <p>$20.000</p>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-dark">
                            <a href="#" className="text-white">Comprar</a>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CardProducts;