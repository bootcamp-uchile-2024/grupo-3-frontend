import React from "react";

const CardProducts: React.FC = () => {
    return (
    <div className="container">
        <h2 className="center">Plantas para llevar a tu hogar</h2>
        <section id="productos">
            <div className="product">
                <div className="product-image" />
                <h3 className="text-center">Monstera</h3>
                <p>$20.000</p>
                <button className="btn btn-dark">
                    <a href="#">Comprar</a>
                </button>
            </div>
            <div className="product">
                <div className="product-image" />
                <h3 className="text-center">Suculenta</h3>
                <p>$20.000</p>
                <button className="btn btn-dark">
                    <a href="#">Comprar</a>
                </button>
            </div>
            <div className="product">
                <div className="product-image" />
                <h3 className="text-center">Ficus</h3>
                <p>$20.000</p>
                <button className="btn btn-dark">
                    <a href="#">Comprar</a>
                </button>
            </div>
        </section>
    </div>
    );
};

export default CardProducts;