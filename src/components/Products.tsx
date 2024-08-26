import React from "react";

const Products: React.FC = () => {
    return (
    <div className="container">
        <h2 className="header-left-sections">Plantas para llevar a tu hogar</h2>
        <section id="productos">
            <div className="product">
                <div className="product-image" />
                <h3>Monstera</h3>
                <p>$20.000</p>
                <button>
                    <a href="#">Comprar</a>
                </button>
            </div>
            <div className="product">
                <div className="product-image" />
                <h3>Suculenta</h3>
                <p>$20.000</p>
                <button>
                    <a href="#">Comprar</a>
                </button>
            </div>
            <div className="product">
                <div className="product-image" />
                <h3>Ficus</h3>
                <p>$20.000</p>
                <button>
                    <a href="#">Comprar</a>
                </button>
            </div>
        </section>
    </div>
    );
};

export default Products;