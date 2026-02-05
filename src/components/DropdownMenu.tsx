import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

interface DropdownMenuContextType {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(
    undefined
)

const DropdownMenu: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
            <div className={cn('relative inline-block text-left', className)}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

const DropdownMenuTrigger: React.FC<{
    children: React.ReactNode
    className?: string
    asChild?: boolean
}> = ({ children, className, asChild }) => {
    const context = useContext(DropdownMenuContext)
    if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu')
    const { isOpen, setIsOpen } = context

    const handleClick = (e: React.MouseEvent) => {
        // Prevent form submission if inside a form
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement, {
            onClick: handleClick,
            className: cn(children.props.className, className),
            'aria-haspopup': true,
            'aria-expanded': isOpen
        } as any)
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn('inline-flex justify-center w-full', className)}
            aria-haspopup="true"
            aria-expanded={isOpen}
        >
            {children}
        </button>
    )
}

interface DropdownMenuContentProps {
    children: React.ReactNode
    className?: string
    align?: 'left' | 'right'
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
    children,
    className,
    align = 'right',
}) => {
    const context = useContext(DropdownMenuContext)
    if (!context) throw new Error('DropdownMenuContent must be used within a DropdownMenu')
    const { isOpen, setIsOpen } = context
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node) && !ref.current.parentElement?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, setIsOpen])

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={cn(
                'absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
                align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
                className
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
        >
            <div className="py-1" role="none">
                {children}
            </div>
        </div>
    )
}

const DropdownMenuItem: React.FC<{
    children: React.ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}> = ({ children, className, onClick, disabled }) => {
    const context = useContext(DropdownMenuContext)
    if (!context) throw new Error('DropdownMenuItem must be used within a DropdownMenu')
    const { setIsOpen } = context

    const handleClick = () => {
        if (disabled) return
        if (onClick) onClick()
        setIsOpen(false)
    }

    return (
        <button
            type="button"
            className={cn(
                'text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            role="menuitem"
            tabIndex={-1}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
