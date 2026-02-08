import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { api } from '../lib/axios'

export abstract class BaseService<T> {
    protected abstract endpoint: string
    protected abstract queryKey: string

    // --- API Methods ---

    getAll = async (): Promise<T[]> => {
        try {
            const response = await api.get<T[]>(this.endpoint)
            return response.data
        } catch (error) {
            console.error('Error fetching all:', error)
            throw error
        }
    }

    getOne = async (id: string | number): Promise<T> => {
        try {
            const response = await api.get<T>(`${this.endpoint}/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error fetching one with id ${id}:`, error)
            throw error
        }
    }

    create = async (data: Partial<T>): Promise<T> => {
        try {
            const response = await api.post<T>(this.endpoint, data)
            return response.data
        } catch (error) {
            console.error('Error creating:', error)
            throw error
        }
    }

    update = async (id: string | number, data: Partial<T>): Promise<T> => {
        try {
            const response = await api.put<T>(`${this.endpoint}/${id}`, data)
            return response.data
        } catch (error) {
            console.error(`Error updating id ${id}:`, error)
            throw error
        }
    }

    delete = async (id: string | number): Promise<void> => {
        try {
            await api.delete(`${this.endpoint}/${id}`)
        } catch (error) {
            console.error(`Error deleting id ${id}:`, error)
            throw error
        }
    }

    // TanStack Query Options

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
