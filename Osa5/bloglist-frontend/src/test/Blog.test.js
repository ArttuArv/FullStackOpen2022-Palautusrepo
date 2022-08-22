import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

const mockHandler = jest.fn()

const blog = {
  title: 'Test title',
  author: 'Test author',
  url: 'Test url',
  likes: 0,
  user: {
    name: 'Test name'
  }
}

test('renders simple content', () => {
  render(
    <Blog blog = {blog} blogLikes = {mockHandler} blogDelete = {mockHandler} />
  )

  expect(screen.getByText('Test title')).toBeDefined()
  expect(screen.getByText('Test author')).toBeDefined()

  // Tarkistetaan ettei näytetä alla olevia tietoja
  expect(screen.queryByText('Test url')).toBeNull()
  expect(screen.queryByText('0')).toBeNull()
  expect(screen.queryByText('Test name')).toBeNull()
})

test('renders all content', async () => {
  render(
    <Blog blog = {blog} blogLikes = {mockHandler} blogDelete = {mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('Hide')).toBeDefined()
  expect(screen.getByText('Like')).toBeDefined()
  expect(screen.getByText('Test title')).toBeDefined()
  expect(screen.getByText('Test author')).toBeDefined()
  expect(screen.getByText('Test url')).toBeDefined()
  expect(screen.getByText('Test name')).toBeDefined()
})

test('like button is clicked twice', async () => {
  render(
    <Blog blog = {blog} blogLikes = {mockHandler} blogDelete = {mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
