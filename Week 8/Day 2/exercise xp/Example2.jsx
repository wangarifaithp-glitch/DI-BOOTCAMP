import { Component } from 'react'
import data from './data.json'

class Example2 extends Component {
  render() {
    return (
      <section>
        <h3>Skills</h3>
        {data.Skills.map((area) => (
          <div key={area.Area}>
            <h4>{area.Area}</h4>
            <ul>
              {area.SkillSet.map((skill) => (
                <li key={skill.Name}>
                  {skill.Name}
                  {skill.Hot && ' (Hot)'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    )
  }
}

export default Example2
