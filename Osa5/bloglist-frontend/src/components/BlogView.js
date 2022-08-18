import { useState } from 'react'
import Blog from './Blog'

const BlogView = ({ blogs }) => {
  const [newBlog, setNewBlog] = useState('')


  return (
    <>
      <h1>Blogs</h1>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )
}

export default BlogView