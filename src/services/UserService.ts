import { BaseService } from './BaseService'

export interface User {
    id: number
    name: string
    email: string
    username: string
    phone: string
    website: string
    company: {
        name: string
    }
}

class UserService extends BaseService<User> {
    protected endpoint = '/users' // API endpoint
    protected queryKey = 'users' // Query key
}

export const userService = new UserService()
