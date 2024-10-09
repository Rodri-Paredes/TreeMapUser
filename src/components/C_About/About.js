import React from 'react';
import './About.css';
import messages from 'config/messages.json';

function About() {
  const aboutMessages = messages.about;
  
  return (
    <div className="about-container"> 
      <h2>{aboutMessages.title}</h2>
      <h3>{aboutMessages.project.header}</h3>
      <p>{aboutMessages.project.description}</p>

      <h3>{aboutMessages.mission.header}</h3>
      <p>{aboutMessages.mission.description}</p>

      <h3>{aboutMessages.vision.header}</h3>
      <p>{aboutMessages.vision.description}</p>

      <h3>{aboutMessages.team.header}</h3>
      <p>{aboutMessages.team.description}</p>

      <h4>{aboutMessages.technologies.header}</h4>
      <ul>
        {aboutMessages.technologies.items.map((tech, index) => (
          <li key={index}>{tech}</li>
        ))}
      </ul>

      <h4>{aboutMessages.objectives.header}</h4>
      <ul>
        {aboutMessages.objectives.items.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>
    </div>
  );
}

export default About;
