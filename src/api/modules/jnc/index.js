import axios from 'axios'

const instance = axios.create({
    baseURL: 'api/jnc'
})


export const exportAPIGetDevices = (params) => instance.get('/devices', {params})