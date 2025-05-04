import React from 'react';
import './About.css';
import messages from 'config/messages.json';

function About() {
  const aboutMessages = messages.about;

  return (
    <div className="about-container">
      <header className="about-header">
        <h2>{aboutMessages.title}</h2>
        <p className="about-subtitle">Conoce más sobre nuestro proyecto, misión, visión y equipo.</p>
      </header>

      <section className="about-section">
        <h3>{aboutMessages.project.header}</h3>
        <p>{aboutMessages.project.description}</p>
      </section>

      <section className="about-section">
        <h3>{aboutMessages.mission.header}</h3>
        <p>{aboutMessages.mission.description}</p>
      </section>

      <section className="about-section">
        <h3>{aboutMessages.vision.header}</h3>
        <p>{aboutMessages.vision.description}</p>
      </section>

      <section className="about-section">
        <h3>{aboutMessages.team.header}</h3>
        <p>{aboutMessages.team.description}</p>
      </section>

      <section className="about-section">
        <h4>{aboutMessages.technologies.header}</h4>
        <ul>
          {aboutMessages.technologies.items.map((tech, index) => (
            <li key={index}>🛠 {tech}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h4>{aboutMessages.objectives.header}</h4>
        <ul>
          {aboutMessages.objectives.items.map((objective, index) => (
            <li key={index}>🌱 {objective}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default About;
