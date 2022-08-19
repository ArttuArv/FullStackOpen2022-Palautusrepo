import PropTypes from 'prop-types'

import { useState } from 'react'

const LoginForm = ({ userLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    userLogin({
      username: username,
      password: password,
    })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  userLogin: PropTypes.func.isRequired
}

export default LoginForm