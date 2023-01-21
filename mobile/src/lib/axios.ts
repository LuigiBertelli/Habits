import axios from 'axios'

import serverConfig from '../configs/server.json'

export const api = axios.create({
    baseURL: serverConfig.baseURL
})