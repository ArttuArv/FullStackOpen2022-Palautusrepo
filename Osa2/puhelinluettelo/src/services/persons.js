import axios from 'axios'
const baseUrl = '/api/persons'


const getAll = () => {
    const request = axios.get(baseUrl);
    console.log('GET request', request);
    return request.then(response => response.data);
}

const createPerson = newObject => {
    const request = axios.post(baseUrl, newObject);
    console.log('POST request', request);
    return request.then(response => response.data);
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    console.log('DELETE request', request);
    return request.then(response => response.data);
}

const updatePerson = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
}

export default { getAll, createPerson, deletePerson, updatePerson }