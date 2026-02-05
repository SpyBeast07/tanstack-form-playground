import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export interface SelectOption {
    label: string
    value: string | number
}

export interface SelectProps<T extends FieldValues = FieldValues> extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'name'
> {
    id?: string
    label?: string
    placeholder?: string
    className?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    icon?: LucideIcon
    options: SelectOption[]
    error?: string
    helperText?: string
}

const Select = <T extends FieldValues = FieldValues>({
    id,
    label = '',
    placeholder = '',
    className = '',
    control,
    name,
    rules = {},
    icon: Icon,
    options,
    error: externalError,
    helperText,
    disabled,
    ...props
}: SelectProps<T>) => {
    const selectId = id || name

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
                const descriptionId = `${selectId}-description`
                const hasDescription = hasError || helperText

                return (
                    <div className={cn('flex flex-col', className)}>
                        {label && (
                            <label
                                htmlFor={selectId}
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                {label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <div className="relative">
                            {Icon && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                    <Icon size={20} />
                                </div>
                            )}
                            <select
                                id={selectId}
                                data-testid={selectId}
                                className={cn(
                                    'flex h-10 w-full px-3 py-2 text-base transition-all duration-200 appearance-none',
                                    'border-2 rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'md:text-sm',
                                    Icon ? 'pl-10' : '',
                                    'pr-10', // Space for chevron
                                    hasError
                                        ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                                    'bg-white',
                                    // Placeholder styling logic can be complex in pure select, relying on value
                                    !field.value && placeholder ? 'text-gray-400' : 'text-gray-900'
                                )}
                                disabled={disabled}
                                aria-invalid={hasError ? 'true' : 'false'}
                                aria-required={isRequired ? 'true' : undefined}
                                aria-describedby={hasDescription ? descriptionId : undefined}
                                {...field}
                                {...props}
                            >
                                {placeholder && (
                                    <option value="" disabled hidden>
                                        {placeholder}
                                    </option>
                                )}
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                <ChevronDown size={20} />
                            </div>
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

Select.displayName = 'Select'

export default Select
