import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export interface InputProps<T extends FieldValues = FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name'
> {
    id?: string
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    className?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    icon?: LucideIcon
    error?: string
    helperText?: string
}

const Input = <T extends FieldValues = FieldValues>({
    id,
    label = '',
    placeholder = '',
    type = 'text',
    className = '',
    control,
    name,
    rules = {},
    icon: Icon,
    error: externalError,
    helperText,
    ...props
}: InputProps<T>) => {
    const inputId = id || name

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => {
                const hasError = fieldState.error || externalError
                const errorMessage = fieldState.error?.message || externalError
                const isRequired =
                    rules && typeof rules === 'object' && 'required' in rules
                const descriptionId = `${inputId}-description`
                const hasDescription = hasError || helperText

                return (
                    <div className={cn('flex flex-col', className)}>
                        {label && (
                            <label
                                htmlFor={inputId}
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                {label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <div className="relative">
                            {Icon && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Icon size={20} />
                                </div>
                            )}
                            <input
                                id={inputId}
                                data-testid={inputId}
                                type={type}
                                placeholder={placeholder}
                                className={cn(
                                    'flex h-10 w-full px-3 py-2 text-base transition-all duration-200',
                                    'border-2 rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'md:text-sm',
                                    Icon && 'pl-10',
                                    hasError
                                        ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                                    'bg-white placeholder:text-gray-400',
                                )}
                                aria-invalid={hasError ? 'true' : 'false'}
                                aria-required={isRequired ? 'true' : undefined}
                                aria-describedby={hasDescription ? descriptionId : undefined}
                                {...field}
                                {...props}
                            />
                        </div>
                        {hasError && (
                            <span id={descriptionId} className="text-sm text-red-500 mt-1">
                                {errorMessage}
                            </span>
                        )}
                        {!hasError && helperText && (
                            <span
                                id={descriptionId}
                                className="text-sm text-gray-400 mt-1"
                            >
                                {helperText}
                            </span>
                        )}
                    </div>
                )
            }}
        />
    )
}

Input.displayName = 'Input'

export default Input
