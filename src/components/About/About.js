import React from 'react';
import './About.css';


function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Acerca de Nosotros</h2>
      <h3>Acerca del Proyecto</h3>
      <p>Somos un grupo comprometido con la mejora de los métodos de censo de árboles para el GAC (Grupo de Acción Comunitaria). Nuestro sistema está diseñado para censar y monitorizar los árboles de forma eficiente, comenzando con los ubicados en Univalle Tiquipaya...</p>

      <h3>Misión</h3>
      <p>Nuestra misión es proporcionar al GAC una herramienta tecnológica que facilite el censo y seguimiento de los árboles de Univalle Tiquipaya...</p>

      <h3>Visión</h3>
      <p>A futuro, planeamos expandir nuestro sistema a otras áreas y municipios...</p>

      <h3>Equipo de Desarrollo</h3>
      <p>Somos un equipo multidisciplinario de estudiantes apasionados por la tecnología y el medio ambiente...</p>

      <h4>Tecnologías Utilizadas</h4>
      <ul>
        <li>Leaflet.js</li>
        <li>React.js</li>
      </ul>

      <h4>Objetivos del Proyecto</h4>
      <ul>
        <li>Desarrollar un sistema eficiente para el censo de árboles en Univalle Tiquipaya.</li>
        <li>Facilitar la toma de decisiones sobre el cuidado y conservación de árboles.</li>
      </ul>
    </div>
  );
}

export default About;
