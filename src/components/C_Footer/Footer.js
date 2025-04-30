import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h5>🌿 Arbolitos</h5>
          <ul>
            <li>Sobre el proyecto</li>
            <li>Colaboradores</li>
            <li>Objetivos</li>
          </ul>
        </div>
        <div>
          <h5>🧭 Explorar</h5>
          <ul>
            <li>Mapa Interactivo</li>
            <li>Especies</li>
            <li>Estadísticas</li>
            <li>Historial</li>
          </ul>
        </div>
        <div>
          <h5>🛠 Soporte</h5>
          <ul>
            <li>FAQ</li>
            <li>Contacto</li>
            <li>Política de Privacidad</li>
          </ul>
        </div>
        <div>
          <h5>📧 Suscribete</h5>
          <input type="email" placeholder="Tu correo electrónico" />
          <button>Suscribirme</button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Arbolitos. Todos los derechos reservados.</p>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-x-twitter"></i>
          <i className="fab fa-linkedin"></i>
          <i className="fab fa-youtube"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
