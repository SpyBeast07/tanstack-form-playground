import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../lib/utils'

export interface ColorInputProps<T extends FieldValues = FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name'
> {
    id?: string
    label?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    error?: string
    helperText?: string
}

const ColorInput = <T extends FieldValues = FieldValues>({
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
}: ColorInputProps<T>) => {
    const inputId = id || name

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                ...rules,
                pattern: {
                    value: /^#([0-9A-F]{3}){1,2}$/i,
                    message: 'Invalid Hex color code',
                },
            }}
            render={({ field: { value, onChange, onBlur, ...field }, fieldState }) => {
                const hasError = fieldState.error || externalError
                const errorMessage = fieldState.error?.message || externalError
                const isRequired =
                    rules && typeof rules === 'object' && 'required' in rules
                const descriptionId = `${inputId}-description`

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
                        <div className="flex gap-2">
                            <div className="relative flex-shrink-0">
                                <input
                                    type="color"
                                    className="h-10 w-14 p-1 rounded-md border border-gray-300 cursor-pointer bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={value || '#000000'}
                                    onChange={(e) => onChange(e.target.value)}
                                    disabled={disabled}
                                />
                            </div>
                            <div className="relative flex-grow">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    #
                                </div>
                                <input
                                    id={inputId}
                                    type="text"
                                    className={cn(
                                        'flex h-10 w-full pl-7 pr-3 py-2 text-base transition-all duration-200',
                                        'border-2 rounded-md',
                                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                        'md:text-sm',
                                        hasError
                                            ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                                        'bg-white placeholder:text-gray-400'
                                    )}
                                    value={value ? value.replace('#', '') : ''}
                                    onChange={(e) => {
                                        let newValue = e.target.value
                                        // Allow only hex characters
                                        newValue = newValue.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
                                        onChange(newValue ? `#${newValue}` : '')
                                    }}
                                    onBlur={onBlur}
                                    disabled={disabled}
                                    placeholder="000000"
                                    maxLength={7} // # + 6 chars, but input shows only chars
                                    aria-invalid={hasError ? 'true' : 'false'}
                                    aria-describedby={hasError || helperText ? descriptionId : undefined}
                                    {...field}
                                    {...props}
                                />
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

ColorInput.displayName = 'ColorInput'

export default ColorInput
