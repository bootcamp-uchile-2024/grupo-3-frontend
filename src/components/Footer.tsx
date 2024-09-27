import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
        <nav> 
            <div className="nav-bottom">
                <ul>
                    <li><a href="#">Acerca de nosotros</a></li>
                    <li><a href="#">Contacto</a></li>
                    <li><a href="#">Términos y condiciones</a></li>
                </ul>
            </div>
        </nav>
        <div className="redes-sociales">
            <ul>
                <li><a href="#"><i className="fab fa-facebook"></i>Facebook</a></li>
                <li><a href="#"><i className="fab fa-instagram"></i>Instagram</a></li>
                <li><a href="#"><i className="fab fa-twitter"></i>Twitter</a></li>
            </ul>
        </div>
        <div className="nav-bottom">
            <ul>
                <li className="subscribe d-flex me-2">
                    <input className="form-control me-2" type="email" placeholder="Suscribirse" />
                    <button className="btn btn-dark" type="submit">Suscribirse</button>
                </li>
                <li className="e-mail"><a href="mailto:cotiledon@gmail.com">plantai@gmail.com</a></li>
            </ul>
        </div>
    </footer>
  );
}

export default Footer;

