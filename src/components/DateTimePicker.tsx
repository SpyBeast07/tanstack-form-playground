import React, { useState, useRef, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
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
}: DateTimePickerProps<T>) => {
    const pickerId = id || name
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Calendar state
    const [viewDate, setViewDate] = useState(new Date())

    // Time state
    const [hours, setHours] = useState('12')
    const [minutes, setMinutes] = useState('00')
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM')

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false)
                inputRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen])

    const formatDateTime = (dateStr: string): string => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return ''

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const month = months[date.getMonth()]
        const day = date.getDate().toString().padStart(2, '0')
        const year = date.getFullYear()

        let hrs = date.getHours()
        const ampm = hrs >= 12 ? 'PM' : 'AM'
        hrs = hrs % 12 || 12
        const mins = date.getMinutes().toString().padStart(2, '0')

        return `${month} ${day}, ${year} - ${hrs}:${mins} ${ampm}`
    }

    const parseDateTime = (dateStr: string) => {
        if (!dateStr) return
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return

        setViewDate(date)
        let hrs = date.getHours()
        const ampm = hrs >= 12 ? 'PM' : 'AM'
        hrs = hrs % 12 || 12
        setHours(hrs.toString().padStart(2, '0'))
        setMinutes(date.getMinutes().toString().padStart(2, '0'))
        setPeriod(ampm)
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        return new Date(year, month, 1).getDay()
    }

    const handleDateSelect = (day: number, onChange: (value: string) => void) => {
        // Convert 12-hour format to 24-hour format
        let hrs = parseInt(hours) || 12
        if (period === 'PM' && hrs !== 12) hrs += 12
        if (period === 'AM' && hrs === 12) hrs = 0

        const mins = parseInt(minutes) || 0

        // Create date string in local time format YYYY-MM-DDTHH:mm
        const year = viewDate.getFullYear()
        const month = viewDate.getMonth()
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
        onChange(`${dateStr}T${timeStr}`)
    }

    const handleTimeChange = (
        onChange: (value: string) => void,
        currentValue: string,
        newHours?: string,
        newMinutes?: string,
        newPeriod?: 'AM' | 'PM'
    ) => {
        // Use provided values or fall back to state
        const currentHours = newHours !== undefined ? newHours : hours
        const currentMinutes = newMinutes !== undefined ? newMinutes : minutes
        const currentPeriod = newPeriod !== undefined ? newPeriod : period

        // Convert 12-hour format to 24-hour format
        let hrs = parseInt(currentHours) || 12
        if (currentPeriod === 'PM' && hrs !== 12) hrs += 12
        if (currentPeriod === 'AM' && hrs === 12) hrs = 0

        const mins = parseInt(currentMinutes) || 0

        if (!currentValue) {
            // If no date selected, use the date from viewDate (the calendar's current view)
            const year = viewDate.getFullYear()
            const month = viewDate.getMonth()
            const day = viewDate.getDate()

            // Create date string in local time format YYYY-MM-DDTHH:mm
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
            onChange(`${dateStr}T${timeStr}`)
        } else {
            // Parse the existing date value (format: YYYY-MM-DDTHH:mm)
            const [datePart] = currentValue.split('T')
            const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
            onChange(`${datePart}T${timeStr}`)
        }
    }

    const renderCalendar = (selectedValue: string, onChange: (value: string) => void) => {
        const daysInMonth = getDaysInMonth(viewDate)
        const firstDay = getFirstDayOfMonth(viewDate)
        const days = []

        const selectedDate = selectedValue ? new Date(selectedValue) : null
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8" />)
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
            currentDate.setHours(0, 0, 0, 0)

            const isSelected = selectedDate &&
                currentDate.getDate() === selectedDate.getDate() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear()

            const isToday = currentDate.getTime() === today.getTime()

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day, onChange)}
                    className={cn(
                        'h-8 w-8 rounded-md text-sm transition-colors',
                        'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                        isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                        !isSelected && isToday && 'bg-blue-100 font-semibold',
                        !isSelected && !isToday && 'text-gray-700'
                    )}
                >
                    {day}
                </button>
            )
        }

        return days
    }

    const previousMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']

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
                    <div className={cn('flex flex-col', className)} ref={dropdownRef}>
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
                                ref={inputRef}
                                id={pickerId}
                                type="text"
                                readOnly
                                value={formatDateTime(field.value)}
                                onClick={() => {
                                    if (!disabled) {
                                        setIsOpen(!isOpen)
                                        if (field.value) {
                                            parseDateTime(field.value)
                                        }
                                    }
                                }}
                                className={cn(
                                    'flex h-10 w-full pl-12 pr-3 py-2 text-base transition-all duration-200 cursor-pointer',
                                    'border-2 rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'md:text-sm',
                                    hasError
                                        ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                                    'bg-white placeholder:text-gray-400'
                                )}
                                placeholder="Select date and time"
                                disabled={disabled}
                                aria-invalid={hasError ? 'true' : 'false'}
                                aria-describedby={hasError || helperText ? descriptionId : undefined}
                            />

                            {isOpen && (
                                <div className="absolute z-50 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 w-80">
                                    {/* Calendar Section */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <button
                                                type="button"
                                                onClick={previousMonth}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <span className="font-semibold text-gray-900">
                                                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={nextMonth}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>

                                        {/* Day headers */}
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {renderCalendar(field.value, field.onChange)}
                                        </div>
                                    </div>

                                    {/* Time Section */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Time</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max="12"
                                                value={hours}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value)
                                                    if (val >= 1 && val <= 12) {
                                                        const newHours = e.target.value.padStart(2, '0')
                                                        setHours(newHours)
                                                        // Pass the new value directly to avoid stale state
                                                        handleTimeChange(field.onChange, field.value, newHours, undefined, undefined)
                                                    }
                                                }}
                                                className="w-16 px-2 py-1 text-center border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                                            />
                                            <span className="text-gray-500">:</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={minutes}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value)
                                                    if (val >= 0 && val <= 59) {
                                                        const newMinutes = e.target.value.padStart(2, '0')
                                                        setMinutes(newMinutes)
                                                        // Pass the new value directly to avoid stale state
                                                        handleTimeChange(field.onChange, field.value, undefined, newMinutes, undefined)
                                                    }
                                                }}
                                                className="w-16 px-2 py-1 text-center border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                                            />
                                            <div className="flex border-2 border-gray-300 rounded overflow-hidden ml-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPeriod('AM')
                                                        handleTimeChange(field.onChange, field.value, undefined, undefined, 'AM')
                                                    }}
                                                    className={cn(
                                                        'px-3 py-1 text-sm font-medium transition-colors',
                                                        period === 'AM'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    )}
                                                >
                                                    AM
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPeriod('PM')
                                                        handleTimeChange(field.onChange, field.value, undefined, undefined, 'PM')
                                                    }}
                                                    className={cn(
                                                        'px-3 py-1 text-sm font-medium transition-colors border-l-2 border-gray-300',
                                                        period === 'PM'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    )}
                                                >
                                                    PM
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Done button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Done
                                    </button>
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

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
