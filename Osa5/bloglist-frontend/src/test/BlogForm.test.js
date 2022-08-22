import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from '../components/BlogForm'
import userEvent from '@testing-library/user-event'

test('<Blogform /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('Write title here')
  const inputAuthor = screen.getByPlaceholderText('Write author here')
  const inputUrl = screen.getByPlaceholderText('Write url here')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testing a form...')
  await user.type(inputAuthor, 'testing a author...')
  await user.type(inputUrl, 'testing a url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a url...')
})
