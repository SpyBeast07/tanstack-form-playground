import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { api } from '../lib/axios'

export abstract class BaseService<T> {
    protected abstract endpoint: string
    protected abstract queryKey: string

    // --- API Methods ---

    getAll = async (): Promise<T[]> => {
        const response = await api.get<T[]>(this.endpoint)
        return response.data
    }

    getOne = async (id: string | number): Promise<T> => {
        const response = await api.get<T>(`${this.endpoint}/${id}`)
        return response.data
    }

    create = async (data: Partial<T>): Promise<T> => {
        const response = await api.post<T>(this.endpoint, data)
        return response.data
    }

    update = async (id: string | number, data: Partial<T>): Promise<T> => {
        const response = await api.put<T>(`${this.endpoint}/${id}`, data)
        return response.data
    }

    delete = async (id: string | number): Promise<void> => {
        await api.delete(`${this.endpoint}/${id}`)
    }

    // --- TanStack Query Options ---

    getAllOptions = () => {
        return queryOptions({
            queryKey: [this.queryKey],
            queryFn: this.getAll,
        })
    }

    getOneOptions = (id: string | number) => {
        return queryOptions({
            queryKey: [this.queryKey, id],
            queryFn: () => this.getOne(id),
        })
    }
}
