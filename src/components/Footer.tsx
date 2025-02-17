import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo" aria-label="PlantAI Logo"></div>

        {/* Grid contenedor principal */}
        <div className="footer-content">
          {/* Infórmate */}
          <div className="footer-section">
            <h6>Infórmate</h6>
            <ul className="footer-links">
              <li></li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
              <li><a href="#tracking">Seguimiento de Pedido</a></li>
              <li><a href="#returns">Devoluciones y Cambios</a></li>
              <li><a href="#shipping-policy">Política de Despacho</a></li>
            </ul>
          </div>

          {/* ¿Necesitas ayuda? */}
          <div className="footer-section">
            <h6>¿Necesitas ayuda?</h6>
            <ul className="footer-links">
              <li><a href="#payment-methods">Medios de Pago</a></li>
              <li><a href="#about">Acerca de Nosotros</a></li>
              <li><a href="#sell-with-us">Vende con Nosotros</a></li>
              <li><a href="#work-with-us">Trabaja con Nosotros</a></li>
            </ul>
          </div>

          {/* Síguenos */}
          <div className="footer-section social-section">
            <h6>Síguenos</h6>
            <ul className="social-icons d-flex justify-content-left align-items-left list-unstyled gap-3">
                  <li>
                    <a href="#twitter" title="Twitter" aria-label="Twitter">
                      <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.7684 8.15375C10.7684 6.2499 12.3249 4.66625 14.1758 4.69221C14.824 4.69991 15.4563 4.9 15.9966 5.26845C16.5369 5.63689 16.9623 6.158 17.2215 6.76913H20.1915L17.4739 9.56432C17.2985 12.3721 16.0901 15.0058 14.0944 16.93C12.0986 18.8542 9.46533 19.9244 6.72989 19.923C4.03757 19.923 3.36449 18.8845 3.36449 18.8845C3.36449 18.8845 6.05681 17.8461 7.40297 15.7691C7.40297 15.7691 2.01833 12.9999 3.36449 5.38452C3.36449 5.38452 6.72989 8.84606 10.7684 9.53836V8.15375Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>

                  <li>
                    <a href="#whatsapp" title="WhatsApp" aria-label="WhatsApp">
                      <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.3581 15.8555C3.35596 14.1164 3.00542 12.0609 3.3723 10.0749C3.73918 8.08881 4.79824 6.30878 6.35066 5.06895C7.90308 3.82912 9.8421 3.21477 11.8037 3.34121C13.7653 3.46766 15.6146 4.32621 17.0043 5.75569C18.3941 7.18518 19.2288 9.08728 19.3518 11.1049C19.4747 13.1226 18.8774 15.117 17.672 16.7137C16.4666 18.3105 14.736 19.3998 12.8051 19.7772C10.8742 20.1545 8.87581 19.794 7.18504 18.7632L4.39176 19.5767C4.27732 19.6111 4.15598 19.6132 4.04046 19.5828C3.92494 19.5524 3.8195 19.4906 3.73519 19.4039C3.65087 19.3172 3.59079 19.2087 3.56124 19.0899C3.53169 18.9711 3.53376 18.8463 3.56724 18.7286L4.3581 15.8555Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>

                  <li>
                    <a href="#instagram" title="Instagram" aria-label="Instagram">
                      <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Phosphor Icons / InstagramLogo">
                          <path d="M10.8459 15.0769C12.7045 15.0769 14.2113 13.5271 14.2113 11.6153C14.2113 9.70359 12.7045 8.15381 10.8459 8.15381C8.98721 8.15381 7.48047 9.70359 7.48047 11.6153C7.48047 13.5271 8.98721 15.0769 10.8459 15.0769Z" stroke="white" strokeMiterlimit="10" />
                          <path d="M14.5478 3.65381H7.14395C4.91356 3.65381 3.10547 5.51355 3.10547 7.80765V15.423C3.10547 17.7171 4.91356 19.5769 7.14395 19.5769H14.5478C16.7782 19.5769 18.5863 17.7171 18.5863 15.423V7.80765C18.5863 5.51355 16.7782 3.65381 14.5478 3.65381Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15.2206 8.15383C15.7782 8.15383 16.2302 7.68889 16.2302 7.11537C16.2302 6.54184 15.7782 6.0769 15.2206 6.0769C14.663 6.0769 14.2109 6.54184 14.2109 7.11537C14.2109 7.68889 14.663 8.15383 15.2206 8.15383Z" fill="white" />
                        </g>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#facebook" title="Facebook" aria-label="Facebook">
                      <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="facebook-icon">
                          <path d="M11.3845 1.30762H8.44743C7.14915 1.30762 5.90403 1.74525 4.98609 2.52425C4.06804 3.30325 3.55231 4.3598 3.55231 5.46146V7.95377H0.615234V11.2768H3.55231V17.923H7.46841V11.2768H10.4055L11.3845 7.95377H7.46841V5.46146C7.46841 5.24113 7.5716 5.02982 7.75517 4.87402C7.93873 4.71822 8.1878 4.63069 8.44743 4.63069H11.3845V1.30762Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </a>
                  </li>
                </ul>
            <div className="subscription-area">
              <p className="footer-subscription-text">
                Inscríbete y obtén 15% OFF en tu primera compra
              </p>
              <form className="footer-subscription-form">
                <input
                  type="email"
                  placeholder="Correo"
                  className="footer-input rounded-pill"
                />
                <p>Centro de Ayuda</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;