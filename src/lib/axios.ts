import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Log the request
        console.log(`%c[Request] ${config.method?.toUpperCase()} ${config.url}`, 'color: #3b82f6; font-weight: bold;')

        // Add a fake authorization token
        config.headers.Authorization = 'Bearer fake-token-123'

        return config
    },
    (error) => {
        console.error('[Request Error]', error)
        return Promise.reject(error)
    }
)

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Log the response
        console.log(`%c[Response] ${response.status} ${response.config.url}`, 'color: #10b981; font-weight: bold;')
        return response
    },
    (error) => {
        // Handle global errors here
        console.error('[Response Error]', error)
        return Promise.reject(error)
    }
)
