import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

// Tehdään nää Notificationin tyylit tälleen kun olen sen verran kehno tekee CSS:ää
const errorStyle = {
  color: 'red',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px',
}

const successStyle = {
  color: 'green',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px',
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  // Get all blogs from the server
  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    })
  }, [])

  // To check localStorage if the user is logged in or not
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // User logout
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // User login
  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage('Login successful')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // Add new blog
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const blog = blogs.find(blog => blog.user.id === returnedBlog.user)
        const newBlog = {
          ...returnedBlog,
          user: {
            ...blog.user
          }
        }
        setBlogs(blogs.concat(newBlog))
        setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(exception => {
        setErrorMessage('error: Blog not created')
        console.log('error', exception)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  // Like a blog function
  const likeBlog = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        const oldBlog = blogs.find(blog => blog.id === id)
        const newBlog = {
          id: returnedBlog.id,
          title: returnedBlog.title,
          author: returnedBlog.author,
          url: returnedBlog.url,
          likes: returnedBlog.likes,
          user: oldBlog.user
        }
        setBlogs(blogs.map(blog => blog.id !== id ? blog : newBlog))
        setSuccessMessage(`You liked ${newBlog.title} blog owned by ${newBlog.user.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(exception => {
        setErrorMessage('error: ',  exception.response.error )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  // Delete a blog function
  const deleteBlog = (id) => {
    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setSuccessMessage('Blog deleted')
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(exception => {
        setErrorMessage('Error: ' + exception.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  return (
    <>
      {errorMessage && <Notification message = {errorMessage} style = {errorStyle} />}
      {successMessage && <Notification message = {successMessage} style = {successStyle} />}
      <h1>Blogs</h1>
      {user === null
        ? <Togglable buttonLabel = 'Login'>
          <LoginForm userLogin = {handleLogin} />
        </Togglable>
        : <>
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          <Togglable buttonLabel = 'Create New Blog' ref = {blogFormRef}>
            <BlogForm createBlog = {addBlog} />
          </Togglable>
          <>
            {blogs.map(blog =>
              <Blog blogLikes = {likeBlog} blogDelete = {deleteBlog} key={blog.id} blog={blog} />
            )}
          </>
        </>
      }
    </>
  )
}

export default App
