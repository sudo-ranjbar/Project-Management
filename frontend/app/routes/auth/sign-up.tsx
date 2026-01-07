import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import HeaderImage from '/react-router-logo.png'
import { useSignUpMutation } from '@/hooks/auth'
import { toast } from 'sonner'

export type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
	const navigate = useNavigate()
	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: ""
		}
	})

	const { mutate, isPending } = useSignUpMutation()

	const submitFunction: SubmitHandler<SignUpFormData> = (formData: SignUpFormData) => {
		mutate(formData, {
			onSuccess: () => {
				toast.success("Email verification request sent", {
					description: "Please check your email for a verification link. If you do not see it, please check your spam folder"
				})
				form.reset()
				// new Promise(resolve => setTimeout((resolve), 1000))
				navigate('/sign-in')
			},
			onError: (err: any) => {
				console.log(err)
				const errorMessage = err.response?.data?.message || "An error occurred"
				toast.error(errorMessage)
			}
		})
	}

	return (
		<div className='flex flex-col justify-center items-center min-h-screen bg-muted/40 p-4'>
			<Card className='max-w-md w-full'>
				<CardHeader className='text-center'>
					<CardTitle className='font-bold lg:text-2xl'>Create an account</CardTitle>
					<CardDescription className='text-sm'>Create your account to continue</CardDescription>
					<div className='w-[60%] mx-auto'>
						<img src={HeaderImage} alt="..." className='w-full h-auto object-contain' />
					</div>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(submitFunction)} className='space-y-6'>
							{/* name */}
							<FormField control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input type='text' placeholder='John Doe' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* email */}
							<FormField control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='email@example.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* password */}
							<FormField control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type='password' placeholder='********' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* confirm password */}
							<FormField control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Repeat Password</FormLabel>
										<FormControl>
											<Input type='password' placeholder='********' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								disabled={isPending}
								variant="default"
								type='submit'
								className='w-full bg-blue-700 text-white hover:bg-blue-500 cursor-pointer'>Sign up</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter>
					<div className='w-full flex items-center justify-center gap-2 text-sm text-slate-700'>
						<span>Already have an account?</span>
						<Link to="/sign-in" className='hover:underline text-blue-700'>Sign in</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default SignUp