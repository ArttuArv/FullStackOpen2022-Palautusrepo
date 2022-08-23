describe('Blog app', function() {

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Fitzgerald Kennedy',
    url: 'https://www.testisivu.com',
    likes: 5,
  }

  const blog2 = {
    title: 'Blog of many likes',
    author: 'Richard Nixon',
    url: 'https://www.testisivu9000.com',
    likes: 4,
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Super Hessu',
      username: 'rooty',
      password: 'salainen'
    }

    const user2 = {
      name: 'Super Mikki',
      username: 'rooster',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Renders page header and login button', function() {
    cy.contains('Blogs')
    cy.contains('Login')
  })

  it('Login form is shown', function() {
    cy.contains('Login').click()
  })

    describe('Login',function() {

    it('user can login', function() {
      cy.contains('Login').click()  // Login pitää klikata uudestaan auki

      cy.get('#username').type('rooty')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Super Hessu logged in')
    })

    it('fails with wrong password', function() {
      cy.contains('Login').click()  // Login pitää klikata uudestaan auki
      cy.get('#username').type('rooty')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
  
      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
  
      cy.get('html').should('not.contain', 'Super Hessu logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'rooty', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('Create New Blog').click()

      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
    
      cy.get('#create-button').click()

    })

    describe('and a blog exists', function () {
      beforeEach(function() {
        cy.addBlog({
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes
        })

        cy.addBlog({
          title: blog2.title,
          author: blog2.author,
          url: blog2.url,
          likes: blog2.likes
        })
      })

      it('a blog exists', function() {
        cy.contains(blog.title)
      })

      it('a blog can be viewed', function() {
        cy.contains('view').click()
      })

      it('a blog can be liked', function() {
        cy.contains('view').click()
        cy.contains('Like').click()

        cy.get('.error')
        .should('contain', 'You liked Component testing is done with react-testing-library blog owned by Super Hessu')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      })
      
      it('most liked blog is on top of the list', function() {  
        // open the blog named 'Blog of many likes'
        cy.contains('Blog of many likes').parent().find('button').click()
        cy.contains('Like').click()

        cy.wait(1000)
        cy.contains('Like').click()
        cy.wait(1000)
        cy.contains('Like').click()
        cy.wait(1000)

        cy.reload()

        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).contains('Blog of many likes')
          cy.wrap(blogs[1]).contains('Component testing is done with react-testing-library')
        })
      })

      describe('logout', function() {
        beforeEach(function() {
          cy.contains('Logout').click()
        })
  
        it('new user can login', function() {
          cy.contains('Login').click()
          cy.get('#username').type('rooster')
          cy.get('#password').type('salainen')
          cy.get('#login-button').click()
        })
  
        describe('When new user is logged in', function() {
          beforeEach(function() {
            cy.login({ username: 'rooster', password: 'salainen' })
          })          
  
          it('blogs can be viewed', function() {
            cy.contains('view').click()
            
          })

          it('a blog can not be deleted', function() {
            cy.contains('view').click()
            cy.contains('Delete').click()

            cy.get('.error')
              .should('contain', 'Error: You can only delete your own blogs!')
              .should('have.css', 'color', 'rgb(255, 0, 0)')
              .and('have.css', 'border-style', 'solid')
          })          
        })
      })

      it('a blog can be deleted', function() {
        cy.contains('view').click()
        cy.contains('Delete').click()

        cy.get('.error')
          .should('contain', 'Blog deleted')
      })
    })
  }) 
})