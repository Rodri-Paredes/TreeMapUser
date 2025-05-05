import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div>
            <h5> <a><i className="fas fa-solid fa-tree "></i> Arbolitos</a></h5>
            <ul>
              <li><a href="/about"><i className="fas fa-info-circle"></i> Sobre el proyecto</a></li>
              <li><a href="/about"><i className="fas fa-users"></i> Colaboradores</a></li>
              <li><a href="/about"><i className="fas fa-bullseye"></i> Objetivos</a></li>
            </ul>
          </div>
          <div>
            <h5> <a><i className="fas fa-solid fa-compass "></i> Explorar</a></h5>
            <ul>
              <li><a href="/"><i className="fas fa-map-marked-alt"></i> Mapa Interactivo</a></li>
              <li><a href="/treetype"><i className="fas fa-leaf"></i> Especies</a></li>
              <li><a href="/estadisticas"><i className="fas fa-chart-bar"></i> Estadísticas</a></li>
              <li><a href="/history"><i className="fas fa-history"></i> Historial</a></li>
            </ul>
          </div>
          <div>
          <h5> <a><i className="fas fa-solid fa-gear "></i> Soporte</a></h5>
            <ul>
              <li><a href="/about"><i className="fas fa-question-circle"></i> FAQ</a></li>
              <li><a href="/about"><i className="fas fa-envelope"></i> Contacto</a></li>
              <li><a href="/about"><i className="fas fa-shield-alt"></i> Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
          <h5> <a><i className="fa-brands fa-telegram"></i> Suscríbete</a></h5>
            <input type="email" placeholder="Tu correo electrónico" />
            <button>Suscribirme</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Arbolitos. Todos los derechos reservados.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://x.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
