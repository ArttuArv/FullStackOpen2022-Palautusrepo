
const Header = (props) => {
  return (
  <h1> {props.course.name} </h1>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.name} {props.exercises}
      </p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name = {props.course.parts[0].name} exercises = {props.course.parts[0].exercises} />
      <Part name = {props.course.parts[1].name} exercises = {props.course.parts[1].exercises} />
      <Part name = {props.course.parts[2].name} exercises = {props.course.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  let total = 0;
  for (let i = 0; i < props.course.parts.length; i++) {
    total += props.course.parts[i].exercises
  }

  return (
    <div>
      <p>
        Number of exercises {total}
      </p>
    </div>
  )
} 

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course = {course} />
      <Content course = {course} />
      <Total course = {course} />
    </div>
  )
}

export default App
