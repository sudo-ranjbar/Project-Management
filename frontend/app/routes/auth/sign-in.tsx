import { z } from 'zod'
import { signInSchema } from '@/lib/schema'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useSignInMutation } from '@/hooks/auth'
import HeaderImage from '/react-router-logo.png'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader } from 'lucide-react'
import { useAuth } from '@/provider/auth-context'

type SignInFormData = z.infer<typeof signInSchema>

const SignIn = () => {
	const navigate = useNavigate();

	const form = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		}
	})

	const { mutate, isPending } = useSignInMutation();
	const { login } = useAuth();

	const submitFunction: SubmitHandler<SignInFormData> = (values: SignInFormData) => {
		mutate(values, {
			onSuccess: async (data: any) => {
				await login(data)
				toast.success(data.message);
				navigate("/dashboard")
			},
			onError: (error: any) => {
				const errorMessage = error.response?.data?.message || "An error occurred";
				toast.error(errorMessage);
			}
		})
	}

	return (
		<div className='flex flex-col justify-center items-center min-h-screen bg-muted/40 p-4'>
			<Card className='max-w-md w-full'>
				<CardHeader className='text-center'>
					<CardTitle className='font-bold lg:text-2xl'>Welcome back</CardTitle>
					<CardDescription className='text-sm'>Sign in to your account to continue</CardDescription>
					<div className='w-[60%] mx-auto'>
						<img src={HeaderImage} alt="..." className='w-full h-auto object-contain' />
					</div>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(submitFunction)} className='space-y-6'>
							{/* email */}
							<FormField control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input type='text' placeholder='email@example.com' {...field} />
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
										<div className='flex items-center justify-between'>
											<FormLabel>Password</FormLabel>
											<Link to="/forgot-password" className='text-blue-700 text-xs hover:underline '>forgot password?</Link>
										</div>
										<FormControl>
											<Input type='password' placeholder='********' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button variant="default" type='submit' disabled={isPending}
								className='w-full bg-blue-700 text-white hover:bg-blue-500 cursor-pointer'>
								Sign in {isPending && (<Loader className='w-4 h-4 animate-spin' />)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter>
					<div className='w-full flex items-center justify-center gap-2 text-sm text-slate-700'>
						<span>Don&apos;t have an account?</span>
						<Link to="/sign-up" className='hover:underline text-blue-700'>Sign up</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default SignIn