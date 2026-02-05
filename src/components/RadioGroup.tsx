import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../lib/utils'

export interface RadioOption {
    label: string
    value: string | number
}

export interface RadioGroupProps<T extends FieldValues = FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name'
> {
    id?: string
    label?: string
    className?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    options: RadioOption[]
    direction?: 'row' | 'col'
    error?: string
    helperText?: string
}

const RadioGroup = <T extends FieldValues = FieldValues>({
    id,
    label,
    className = '',
    control,
    name,
    rules = {},
    options,
    direction = 'col',
    error: externalError,
    helperText,
    disabled,
    ...props
}: RadioGroupProps<T>) => {
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

                return (
                    <div className={cn('flex flex-col', className)}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                {label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <div
                            className={cn(
                                'flex gap-4',
                                direction === 'col' ? 'flex-col' : 'flex-row flex-wrap'
                            )}
                            role="radiogroup"
                            aria-labelledby={label ? groupId : undefined}
                        >
                            {options.map((option) => {
                                const optionId = `${groupId}-${option.value}`
                                return (
                                    <div key={option.value} className="flex items-center">
                                        <input
                                            id={optionId}
                                            type="radio"
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            value={option.value}
                                            checked={value === option.value}
                                            onChange={onChange}
                                            disabled={disabled}
                                            aria-invalid={hasError ? 'true' : 'false'}
                                            {...field}
                                            {...props}
                                        />
                                        <label
                                            htmlFor={optionId}
                                            className={cn(
                                                'ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none',
                                                disabled && 'opacity-50 cursor-not-allowed',
                                                hasError && 'text-red-500'
                                            )}
                                        >
                                            {option.label}
                                        </label>
                                    </div>
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

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
