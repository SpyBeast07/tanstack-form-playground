import React from 'react'
import { useFieldArray, type Control, type FieldValues, type ArrayPath } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './Table'

export interface Column {
    header: string
    cell: (index: number) => React.ReactNode
    width?: string
}

interface DynamicTableProps<T extends FieldValues> {
    control: Control<T>
    name: ArrayPath<T>
    columns: Column[]
    label?: string
    defaultValues?: any // For appending new rows
}

const DynamicTable = <T extends FieldValues>({
    control,
    name,
    columns,
    label,
    defaultValues = {},
}: DynamicTableProps<T>) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                {label && <h3 className="text-lg font-medium text-gray-900">{label}</h3>}
                <button
                    type="button"
                    onClick={() => append(defaultValues)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Row
                </button>
            </div>

            <div className="border rounded-md overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableHead key={index} style={{ width: col.width }}>
                                    {col.header}
                                </TableHead>
                            ))}
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                {columns.map((col, colIndex) => (
                                    <TableCell key={`${field.id}-${colIndex}`}>
                                        {col.cell(index)}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        aria-label="Delete row"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {fields.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No entries. Click "Add Row" to start.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DynamicTable
