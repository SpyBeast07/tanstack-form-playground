import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../lib/utils'

export interface ChipOption {
    label: string
    value: string | number
}

export interface ChipsProps<T extends FieldValues = FieldValues> extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'id'
> {
    id?: string
    label?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    options: ChipOption[]
    multiple?: boolean
    error?: string
    helperText?: string
    disabled?: boolean
}

const Chips = <T extends FieldValues = FieldValues>({
    id,
    label,
    className = '',
    control,
    name,
    rules = {},
    options,
    multiple = true,
    error: externalError,
    helperText,
    disabled,
    ...props
}: ChipsProps<T>) => {
    const groupId = id || name

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange, ...field }, fieldState }) => {
                const hasError = fieldState.error || externalError
                const errorMessage = fieldState.error?.message || externalError
                const isRequired =
                    rules && typeof rules === 'object' && 'required' in rules
                const descriptionId = `${groupId}-description`

                const handleToggle = (optionValue: string | number) => {
                    if (disabled) return

                    if (multiple) {
                        const currentValues = Array.isArray(value) ? value : []
                        const newValues = currentValues.includes(optionValue)
                            ? currentValues.filter((v: string | number) => v !== optionValue)
                            : [...currentValues, optionValue]
                        onChange(newValues as any)
                    } else {
                        onChange(value === optionValue ? '' : optionValue)
                    }
                }

                const isSelected = (optionValue: string | number) => {
                    if (multiple) {
                        return Array.isArray(value) && value.includes(optionValue)
                    }
                    return value === optionValue
                }

                return (
                    <div className={cn('flex flex-col', className)} {...props}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                {label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <div
                            className="flex flex-wrap gap-2"
                            role="group"
                            aria-labelledby={label ? groupId : undefined}
                        >
                            {options.map((option) => {
                                const optionId = `${groupId}-${option.value}`
                                const selected = isSelected(option.value)

                                return (
                                    <button
                                        key={option.value}
                                        id={optionId}
                                        type="button"
                                        onClick={() => handleToggle(option.value)}
                                        disabled={disabled}
                                        className={cn(
                                            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 border',
                                            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                                            disabled && 'opacity-50 cursor-not-allowed',
                                            selected
                                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                                            hasError && !selected && 'border-red-500 text-red-500'
                                        )}
                                        aria-pressed={selected}
                                        {...field}
                                    >
                                        {option.label}
                                    </button>
                                )
                            })}
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

Chips.displayName = 'Chips'

export default Chips
