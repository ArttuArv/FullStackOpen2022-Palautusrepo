const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {

  if (!request.user) {
    console.log('no user')
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body
  const userId = request.user.id

  const user = await User.findById(userId.toString())

  // console.log('user.id:', user?.id)
  // console.log('user._id:', user?._id.toString())
  // console.log('userId:', userId?.toString())

  if (!user) {
    return response.status(400).json({ error: 'user does not exist' })
  } else {
    if (user._id.toString() === userId.toString()) {
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: userId.toString(),
      })

      const savedBlog = await blog.save()

      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.status(201).json(savedBlog)
    } else {
      return response.status(401).json({ error: 'unauthorized' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = await Blog.findById(request.params.id)
  const userId = request.user.id

  if (blogId) {
    if (blogId.user.toString() === userId.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'unauthorized' })
    }
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blogId = await Blog.findById(request.params.id)
  const userId = request.user.id

  if (blogId) {
    if (blogId.user.toString() === userId.toString()) {
      const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
      }

      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(updatedBlog)
    } else {
      return response.status(401).json({ error: 'unauthorized' })
    }
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter