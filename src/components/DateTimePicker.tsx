import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Calendar, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

export interface DateTimePickerProps<T extends FieldValues = FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type'
> {
    id?: string
    label?: string
    control: Control<T>
    name: Path<T>
    rules?: object
    error?: string
    helperText?: string
}

const DateTimePicker = <T extends FieldValues = FieldValues>({
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
}: DateTimePickerProps<T>) => {
    const pickerId = id || name

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
                const descriptionId = `${pickerId}-description`

                return (
                    <div className={cn('flex flex-col', className)}>
                        {label && (
                            <label
                                htmlFor={pickerId}
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                {label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center gap-1">
                                <Calendar size={16} />
                                <Clock size={16} />
                            </div>
                            <input
                                id={pickerId}
                                type="datetime-local"
                                className={cn(
                                    'flex h-10 w-full pl-12 pr-3 py-2 text-base transition-all duration-200',
                                    'border-2 rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'md:text-sm',
                                    hasError
                                        ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                                    'bg-white placeholder:text-gray-400'
                                )}
                                disabled={disabled}
                                aria-invalid={hasError ? 'true' : 'false'}
                                aria-describedby={hasError || helperText ? descriptionId : undefined}
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

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
