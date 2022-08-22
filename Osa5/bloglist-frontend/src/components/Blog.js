import PropTypes from 'prop-types'

import { useState } from 'react'
import '../index.css'

const Blog = ({ blog, blogLikes, blogDelete }) => {
  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    fontSize: '1.1em',
    textSpacing: '1.5em',
    lineHeight: '0.1em',
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const blogWrapperStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'flex-start',
    width: '100%',
    padding: '5px 0 0 0',
    borderRadius: '5px',
  }

  const simpleBlogData = () => (
    <div style={blogStyle}>
      <p><b>{blog.title}</b> {blog.author}  <button className = 'boxButton' onClick={() => setShowAll(true)}>view</button></p>
    </div>
  )

  const allBlogData = () => (
    <div style = {blogStyle}>
      <p><b>{blog.title}</b><button className = 'boxButton' onClick = {() => setShowAll(false)}>Hide</button></p>
      <p> {blog.author}</p>
      <p> {blog.url}</p>
      <p> {blog.likes}<button className = 'boxButton' onClick = {likeBlog} >Like</button></p>
      <p><b>{blog.user.name}</b></p>
      <button onClick = {deleteBlog}>Delete</button>
    </div>
  )

  const likeBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      likes: blog.likes + 1,
    }

    blogLikes(blog.id, blogObject)
  }

  const deleteBlog = (event) => {
    event.preventDefault()

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogDelete(blog.id)
    }
  }

  return (
    <div style = {blogWrapperStyle}>
      {showAll === true
        ? allBlogData()
        : simpleBlogData()
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogLikes: PropTypes.func.isRequired,
  blogDelete: PropTypes.func.isRequired,
}

export default Blog