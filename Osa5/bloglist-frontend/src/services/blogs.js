import axios from 'axios'
const baseUrl = '/api/blogs'

// Set token
let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('config: ', config)
  console.log('newObject: ', newObject)

  const response = await axios.post(baseUrl, newObject, config)
  console.log('response: ', response)
  return response.data
}

export default { getAll, create, setToken }