import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getOne = (name) => {
    if ((name !== "") && (name !== null) && (name !== undefined)) {
        const request = axios.get(`${baseUrl}api/name/${name}`)
        return request.then(response => response.data)
    } else {
        return null
    }
}


const exportedObject = {
    getOne,
}

export default exportedObject;