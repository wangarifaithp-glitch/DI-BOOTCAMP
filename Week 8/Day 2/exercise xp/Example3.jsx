import { Component } from 'react'
import data from './data.json'

class Example3 extends Component {
  render() {
    return (
      <section>
        <h3>Experiences</h3>
        {data.Experiences.map((experience) => (
          <article className="experience" key={experience.companyName}>
            <h4>
              <a href={experience.url} target="_blank" rel="noreferrer">
                {experience.companyName}
              </a>
            </h4>
            {experience.roles.map((role) => (
              <div className="experience-role" key={`${experience.companyName}-${role.title}`}>
                <h5>{role.title}</h5>
                <p>{role.description}</p>
                <p className="text-body-secondary">
                  {role.startDate} – {role.endDate} · {role.location}
                </p>
              </div>
            ))}
          </article>
        ))}
      </section>
    )
  }
}

export default Example3
