import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Mail, Lock, MoreVertical } from 'lucide-react'
import { userService } from '../services/UserService'
import { formSchema, type FormSchema } from '../schemas/formSchema'
import Input from '../components/Input'
import Select from '../components/Select'
import Checkbox from '../components/Checkbox'
import RadioGroup from '../components/RadioGroup'
import Chips from '../components/Chips'
import ColorInput from '../components/ColorInput'
import DateTimePicker from '../components/DateTimePicker'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/Card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/DropdownMenu'
import DynamicTable from '../components/DynamicTable'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data: users, isLoading } = useQuery(userService.getAllOptions())

  const { control, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: '',
      terms: false,
      gender: '',
      department: [],
      themeColor: '#000000',
      appointment: '',
      expenses: [{ description: 'Office Supplies', amount: '50', category: 'supplies' }]
    },
  })

  const onSubmit = (data: FormSchema) => {
    console.log(data)
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              name="email"
              control={control}
              label="Email"
              placeholder="Enter your email"
              type="email"
              icon={Mail}
            />
            <Input
              name="password"
              control={control}
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={Lock}
            />
            <RadioGroup
              name="gender"
              control={control}
              label="Gender"
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              direction="row"
            />
            <Select
              name="role"
              control={control}
              label="Role"
              placeholder="Select a role"
              options={[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
                { label: 'Manager', value: 'manager' },
              ]}
            />
            <Chips
              name="department"
              control={control}
              label="Department"
              options={[
                { label: 'Engineering', value: 'engineering' },
                { label: 'Design', value: 'design' },
                { label: 'Marketing', value: 'marketing' },
                { label: 'Sales', value: 'sales' },
              ]}
              multiple={true}
            />
            <ColorInput
              name="themeColor"
              control={control}
              label="Theme Color"
            />
            <DateTimePicker
              name="appointment"
              control={control}
              label="Appointment Time"
            />
            <Checkbox
              name="terms"
              control={control}
              label="I accept the terms and conditions"
            />
            <CardFooter className="px-0 pb-0 pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In
              </button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <div className="w-full max-w-4xl mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Expense Report</CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicTable
              control={control}
              name="expenses"
              label="Expenses"
              defaultValues={{ description: '', amount: '', category: '' }}
              columns={[
                {
                  header: 'Description',
                  cell: (index) => (
                    <Input
                      control={control}
                      name={`expenses.${index}.description`}
                      placeholder="Expense description"
                    />
                  ),
                },
                {
                  header: 'Amount',
                  width: '150px',
                  cell: (index) => (
                    <Input
                      control={control}
                      name={`expenses.${index}.amount`}
                      type="number"
                      placeholder="0.00"
                    />
                  ),
                },
                {
                  header: 'Category',
                  width: '200px',
                  cell: (index) => (
                    <Select
                      control={control}
                      name={`expenses.${index}.category`}
                      placeholder="Select category"
                      options={[
                        { label: 'Travel', value: 'travel' },
                        { label: 'Meals', value: 'meals' },
                        { label: 'Supplies', value: 'supplies' },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Users</h2>
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableCaption>A list of users fetched via TanStack Query.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.website}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-full">
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => alert(`View details for ${user.name}`)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert(`Edit ${user.name}`)}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
