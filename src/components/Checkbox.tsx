import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../lib/utils'

export interface CheckboxProps<T extends FieldValues = FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name'
> {
    id?: string
    label?: string
    className?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    error?: string
    helperText?: string
}

const Checkbox = <T extends FieldValues = FieldValues>({
    id,
    label,
    className = '',
    control,
    name,
    rules = {},
    error: externalError,
    helperText,
    disabled,
    ...props
}: CheckboxProps<T>) => {
    const checkboxId = id || name

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange, ...field }, fieldState }) => {
                const hasError = fieldState.error || externalError
                const errorMessage = fieldState.error?.message || externalError
                const descriptionId = `${checkboxId}-description`

                return (
                    <div className={cn('flex flex-col', className)}>
                        <div className="flex items-start space-x-3">
                            <div className="flex items-center h-5">
                                <input
                                    id={checkboxId}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    checked={!!value}
                                    onChange={onChange}
                                    disabled={disabled}
                                    aria-invalid={hasError ? 'true' : 'false'}
                                    aria-describedby={hasError || helperText ? descriptionId : undefined}
                                    {...field}
                                    {...props}
                                />
                            </div>
                            {label && (
                                <div className="text-sm">
                                    <label
                                        htmlFor={checkboxId}
                                        className={cn(
                                            'font-medium text-gray-700 select-none cursor-pointer',
                                            disabled && 'opacity-50 cursor-not-allowed',
                                            hasError && 'text-red-500'
                                        )}
                                    >
                                        {label}
                                    </label>
                                    {helperText && !hasError && (
                                        <p id={descriptionId} className="text-gray-500">
                                            {helperText}
                                        </p>
                                    )}
                                    {hasError && (
                                        <p id={descriptionId} className="text-red-500">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }}
        />
    )
}

Checkbox.displayName = 'Checkbox'

export default Checkbox
