const listHelper = require('../utils/list_helper')

const testBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe('List Tests', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  test('dummy returns a number', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(typeof result).toBe('number')
  })
})

describe('Total Likes', () => {

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Hithchikers Guide To The Galaxy',
      author: 'Douglas Adams',
      url: 'https://www.hitchikersguide.com/',
      likes: 42,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(42)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testBlogs)
    expect(result).toBe(36)
  })
})

describe('Favorite Blog', () => {
  test('favorite blog is the one with most likes', () => {
    const result = listHelper.favoriteBlog(testBlogs)
    expect(result).toEqual(testBlogs[2])
    console.log(result)
  })
})

describe('Most blogs', () => {
  test('by Author', () => {
    const result = listHelper.mostBlogs(testBlogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    console.log('Most Blogs: ', result)
  })
})

describe('Most Likes', () => {
  test('by Author', () => {
    const result = listHelper.mostLikes(testBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
    console.log('Most Likes: ', result)
  })
})