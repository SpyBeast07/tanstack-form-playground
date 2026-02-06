import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { RgbaStringColorPicker } from 'react-colorful'
import { colord } from 'colord'
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
    const popover = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    const close = useCallback(() => setIsOpen(false), [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popover.current && !popover.current.contains(event.target as Node)) {
                close()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, close])

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange, onBlur, ref }, fieldState }) => {
                const hasError = fieldState.error || externalError
                const errorMessage = fieldState.error?.message || externalError
                const isRequired =
                    rules && typeof rules === 'object' && 'required' in rules
                const descriptionId = `${inputId}-description`

                // Ensure value is a valid color string, default to black if empty/invalid
                const colorValue = value || 'rgba(0, 0, 0, 1)'

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
                        <div className="relative flex gap-2">
                            <div className="relative" ref={popover}>
                                <button
                                    type="button"
                                    className="h-10 w-10 rounded-md border border-gray-300 shadow-sm cursor-pointer overflow-hidden relative"
                                    style={{ backgroundColor: colorValue }}
                                    onClick={() => !disabled && setIsOpen(!isOpen)}
                                    disabled={disabled}
                                    aria-label="Pick color"
                                >
                                    {/* Checkerboard background for transparency indication */}
                                    <div
                                        className="absolute inset-0 -z-10"
                                        style={{
                                            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                            backgroundSize: '10px 10px',
                                            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                                        }}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="absolute top-12 left-0 z-50 p-2 bg-white rounded-lg shadow-xl border border-gray-200">
                                        <RgbaStringColorPicker
                                            color={colorValue.startsWith('rgba') ? colorValue : colord(colorValue).toRgbString()}
                                            onChange={onChange}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="relative flex-grow">
                                <input
                                    id={inputId}
                                    type="text"
                                    className={cn(
                                        'flex h-10 w-full px-3 py-2 text-base transition-all duration-200',
                                        'border-2 rounded-md',
                                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                        'md:text-sm',
                                        hasError
                                            ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                                        'bg-white placeholder:text-gray-400'
                                    )}
                                    value={value || ''}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={onBlur}
                                    disabled={disabled}
                                    placeholder="rgba(0, 0, 0, 1)"
                                    aria-invalid={hasError ? 'true' : 'false'}
                                    aria-describedby={hasError || helperText ? descriptionId : undefined}
                                    ref={ref}
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
