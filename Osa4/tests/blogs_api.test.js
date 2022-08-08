const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

require('dotenv').config()

const Blog = require('../models/blog')
const User = require('../models/user')

// Kolme muuttujaa joihin tallentaa testien aikana tarvittavia muuttujia kaikkien käytettäväksi
let testUserId = null
let testUser = null
let token = null

describe('When there is initially users at db', () => {
  // BeforeEach muutettu beforeAll:ksi, koska muutoin id:t edellä olevat muuttujat eivät ole käytettävissä
  beforeAll(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash: passwordHash,
    })

    await user.save()
  })

  test('you can get all users', async () => {
    const usersInDb = await helper.usersInDb()

    expect(usersInDb.length).toBe(helper.initialUsers.length + 1)

    const usernames = usersInDb.map(u => u.username)
    expect(usernames).toContain('root')
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  describe('Login', () => {
    test('fails with a statuscode 401 if password is wrong', async () => {
      const login = {
        username: 'root',
        password: 'wrongpassword',
      }

      await api
        .post('/api/login')
        .send(login)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('fails with a statuscode 401 if username is wrong', async () => {
      const login = {
        username: 'wrongusername',
        password: 'sekret',
      }

      await api
        .post('/api/login')
        .send(login)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('fails with a statuscode 401 if username is missing', async () => {
      const login = {
        password: 'sekret',
      }

      await api
        .post('/api/login')
        .send(login)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('succeeds with a statuscode 200 if username and password are correct', async () => {
      const login = {
        username: 'root',
        password: 'sekret',
      }

      const result = await api
        .post('/api/login')
        .send(login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      token = result.body.token
      expect(token).toBeDefined()

      const usersAtEnd = await helper.usersInDb()
      testUser = usersAtEnd.find(u => u.username === 'root')
      testUserId = testUser.id
    })

    describe('When there is initially some blogs saved,', () => {
      beforeAll(async () => {
        await Blog.deleteMany({})

        // const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
        // const promiseArray = blogObjects.map(blog => blog.save())
        // await Promise.all(promiseArray)

        for (let blog of helper.initialBlogs) {
          blog.user = testUserId
          let blogObject = new Blog(blog)
          await blogObject.save()
        }

        // await Blog.insertMany(helper.initialBlogs)
      })

      test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })

      test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
      })

      test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const title = response.body.map(r => r.title)

        expect(title).toContain('React patterns')
      })

      test('the third blog is about "Canonical String Reduction', async () => {
        const response = await api.get('/api/blogs')

        const content = response.body.map(r => r.title)

        expect(content).toContain('Canonical string reduction')
      })

      test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const processedNoteToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedNoteToView)
      })

      test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToDelete = blogsAtStart[0]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set('Authorization', `bearer ${token}`)
          .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(n => n.title)

        expect(titles).not.toContain(blogToDelete.title)
      })

      test('the identifying field of a blog is id and not _id', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        console.log('blogToView:', blogToView)

        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        console.log('resultBlog:', resultBlog.body)

        expect(resultBlog.body.id).toBeDefined()
        expect(resultBlog.body._id).not.toBeDefined()

        expect(resultBlog.body.id).toBe(blogToView.id)
        expect(resultBlog.body.id).not.toBe(blogToView._id)
      })

      test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
          likes: 2000,
        }

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .set('Authorization', `bearer ${token}`)
          .send(updatedBlog)
          .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        const likes = blogsAtEnd.map(n => n.likes)

        expect(likes).toContain(2000)
        expect(likes).not.toContain(blogToUpdate.likes)
      })

      test('blog can not be deleted with wrong token', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToDelete = blogsAtStart[0]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set('Authorization', 'bearer wrongtoken')
          .expect(401)
      })

      describe('Creating a new blog,', () => {
        test('succeeds with proper request.body', async () => {
          const newBlog = {
            title: 'Test blog',
            author: 'Test author',
            url: 'http://www.test.com',
            likes: 0,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

          const blogsAtEnd = await helper.blogsInDb()

          // InitialBlogs ei kasva yhdellä, koska sieltä on kertaalleen testien aikana poistettu yksi blogi.
          expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

          const titles = blogsAtEnd.map(n => n.title)
          expect(titles).toContain('Test blog')
        })

        test('is unsuccesful if blog title is missing', async () => {
          const newBlog = {
            title: '',
            author: 'Test Author',
            url: 'http://www.test.com',
            likes: 0,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

          const blogsAtEnd = await helper.blogsInDb()

          expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })

        test('is unsuccesful if blog author is missing', async () => {
          const newBlog = {
            title: 'Test blog',
            author: '',
            url: 'http://www.test.com',
            likes: 0,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

          const blogsAtEnd = await helper.blogsInDb()

          expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })

        test('is unsuccesful if blog url is missing', async () => {
          const newBlog = {
            title: 'Test blog',
            author: 'Test Author',
            url: '',
            likes: 0,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

          const blogsAtEnd = await helper.blogsInDb()

          expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })

        test('is unsuccesful if blog title field is missing completely', async () => {
          const newBlog = {
            author: 'Missing title',
            url: 'http://www.test.com',
            likes: 0,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

          const blogsAtEnd = await helper.blogsInDb()

          expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

          const authors = blogsAtEnd.map(n => n.author)
          expect(authors).not.toContain('Missing title')
        })

        test('is unsuccesful if bearer token is wrong or malformatted', async () => {
          const newBlog = {
            title: 'Test blog',
            author: 'Test Author',
            url: 'http://www.test.com',
            likes: 0,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', 'bearer 12345')
            .send(newBlog)
            .expect(401)
        })

        test('without likes succeeds and the likes are defaulted zero (0)', async () => {
          const newBlog = {
            title: 'Test blog',
            author: 'Test Author',
            url: 'http://www.test.com',
            likes: undefined,
            user: testUserId,
          }

          await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)

          const blogsAtEnd = await helper.blogsInDb()

          const likes = blogsAtEnd.map(n => n.likes)

          expect(likes).toContain(0)
        })

        describe('If ID is wrong,', () => {
          const invalidID = '62eee804f0208441fdd813f2'

          test('viewing a blog returns 404', async () => {
            await api
              .get(`/api/blogs/${invalidID}`)
              .expect(404)
          })

          test('updating a blog returns 404', async () => {
            await api
              .put(`/api/blogs/${invalidID}`)
              .set('Authorization', `bearer ${token}`)
              .send({ likes: 1 })
              .expect(404)
          })

          test('deleting a blog returns 404', async () => {
            await api
              .delete(`/api/blogs/${invalidID}`)
              .set('Authorization', `bearer ${token}`)
              .expect(404)
          })

        })
      })
    })
  })


})

afterAll(() => {
  mongoose.connection.close()
})