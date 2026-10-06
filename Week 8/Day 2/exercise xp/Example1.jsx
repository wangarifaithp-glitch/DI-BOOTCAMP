import { Component } from 'react'
import data from './data.json'

class Example1 extends Component {
  render() {
    return (
      <section>
        <h3>Social Medias</h3>
        <ul>
          {data.SocialMedias.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    )
  }
}

export default Example1
