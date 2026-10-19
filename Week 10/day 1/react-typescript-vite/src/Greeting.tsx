interface GreetingProps {
  name: string
  messageCount: number
}

function Greeting({ name, messageCount }: GreetingProps) {
  return (
    <article className="example-panel greeting-panel">
      <p className="panel-label">COMPONENT OUTPUT</p>
      <h2>Hello, {name}.</h2>
      <p className="panel-copy">You have <strong>{messageCount}</strong> new messages.</p>
      <pre><code>{'<Greeting name="Sam" messageCount={3} />'}</code></pre>
    </article>
  )
}

export default Greeting