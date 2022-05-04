// Otsikko
const Header = ({courseName}) =>
  <h2> {courseName} </h2>

// Kurssitiedot
const Part = ({name, exercises}) =>
  <>
    <p>
      {name} {exercises}
    </p>
  </>

// Sisältö, jossa loopataan kurssitiedot
const Content = ({courses}) =>
  <>
    {courses.map(parts =>
      <Part key = {parts.id} 
            name = {parts.name} 
            exercises = {parts.exercises} 
      />
    )}
  </>

// Tehtävien yhteenlaskettu määrä
const Total = ({courses}) => { 
  const total = courses.reduce((previous, current) => previous + current.exercises, 0)
  return (
    <>
      <p>
        <b>Number of exercises {total}</b>
      </p>
    </>
  )
} 

// Koko näkymä
const Course = ({courseName, courses}) => {

  console.log("courses", courses)
  console.log("courseName", courseName)

  return (
    <>
      <Header courseName = {courseName} />
      <Content courses = {courses} />
      <Total courses = {courses} /> 
    </>
  )
}

const App = () => {

  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  
  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map(course => 
        <Course key = {course.id} courseName = {course.name} courses = {course.parts} />
      )}
    </>
  )
}

export default App
