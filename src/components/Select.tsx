import React, { useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { ChevronDown, Check, type LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export interface SelectOption {
    label: string
    value: string | number
}

export interface SelectProps<T extends FieldValues = FieldValues> extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'id' | 'onChange'
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
    disabled?: boolean
}

const Select = <T extends FieldValues = FieldValues>({
    id,
    label,
    placeholder = 'Select an option',
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
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange, onBlur }, fieldState }) => {
                const hasError = fieldState.error || externalError
                const errorMessage = fieldState.error?.message || externalError
                const isRequired =
                    rules && typeof rules === 'object' && 'required' in rules
                const descriptionId = `${selectId}-description`
                const selectedOption = options.find((opt) => opt.value === value)

                const handleSelect = (optionValue: string | number) => {
                    onChange(optionValue)
                    setIsOpen(false)
                }

                return (
                    <div ref={containerRef} className={cn('flex flex-col relative', className)} {...props}>
                        {label && (
                            <label
                                htmlFor={selectId}
                                className="block text-sm font-medium text-gray-900 mb-2"
                                onClick={() => !disabled && setIsOpen(!isOpen)}
                            >
                                {label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}

                        <div className="relative">
                            {Icon && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
                                    <Icon size={20} />
                                </div>
                            )}

                            <button
                                type="button"
                                id={selectId}
                                onClick={() => !disabled && setIsOpen(!isOpen)}
                                onBlur={onBlur}
                                disabled={disabled}
                                aria-haspopup="listbox"
                                aria-expanded={isOpen}
                                aria-labelledby={label ? selectId : undefined}
                                className={cn(
                                    'flex h-10 w-full px-3 py-2 text-base text-left items-center justify-between transition-all duration-200',
                                    'border-2 rounded-md bg-white',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'md:text-sm',
                                    Icon ? 'pl-10' : '',
                                    hasError
                                        ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    isOpen ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : '',
                                    !selectedOption && placeholder ? 'text-gray-400' : 'text-gray-900'
                                )}
                            >
                                <span className="truncate">
                                    {selectedOption ? selectedOption.label : placeholder}
                                </span>
                                <ChevronDown size={20} className={cn("text-gray-500 transition-transform duration-200", isOpen && "transform rotate-180")} />
                            </button>

                            {isOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto py-1">
                                    <ul
                                        role="listbox"
                                        aria-activedescendant={selectedOption ? String(selectedOption.value) : undefined}
                                    >
                                        {options.map((option) => (
                                            <li
                                                key={option.value}
                                                id={String(option.value)}
                                                role="option"
                                                aria-selected={value === option.value}
                                                className={cn(
                                                    "relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 text-gray-900 text-sm",
                                                    value === option.value && "bg-blue-50 font-medium text-blue-700"
                                                )}
                                                onClick={() => handleSelect(option.value)}
                                            >
                                                <span className="block truncate">{option.label}</span>
                                                {value === option.value && (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                                        <Check size={16} />
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                        {options.length === 0 && (
                                            <li className="py-2 pl-3 pr-9 text-gray-500 text-sm">No options available</li>
                                        )}
                                    </ul>
                                </div>
                            )}
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
