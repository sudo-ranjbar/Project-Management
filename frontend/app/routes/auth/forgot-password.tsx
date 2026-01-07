import { forgotPasswordSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader, Send } from "lucide-react";
import { Link } from "react-router"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForgotPasswordMutation } from "@/hooks/auth"
import { toast } from "sonner"

export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm<forgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: ""
		}
	})

	const { mutate, isPending } = useForgotPasswordMutation();

	// submit function
	const submitFunction: SubmitHandler<forgotPasswordFormData> = (formData: forgotPasswordFormData) => {
		mutate(formData, {
			onSuccess: async (data: any) => {
				setIsSuccess(true);
				toast.success(data.message);
			},
			onError: (error: any) => {
				toast.error(error.message);
			}
		})
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="max-w-md w-full space-y-6 p-2">
				<div className="flex flex-col items-center justify-center space-y-2">
					<h1 className="text-2xl font-bold">Forgot Password?</h1>
					<p className="text-muted-foreground">Enter your email to reset your password</p>
				</div>
				<Card>
					<CardHeader>
						<Link to="/sign-in" className="flex items-center gap-2">
							<ArrowLeft className="w-4 h-4 text-sm font-bold text-cyan-700" />
							<span className="text-sm font-bold text-cyan-700">Back to sign in page</span>
						</Link>
					</CardHeader>
					<CardContent>
						{isSuccess ?
							(<div className="flex flex-col items-center justify-center space-y-2">
								<CheckCircle className="w-10 h-10 text-green-500"/>
								<h1 className="text-2xl font-bold">Password reset email sent.</h1>
								<p className="text-muted-foreground">Check your email for reset password link.</p>
							</div>) :
							(<Form {...form}>
								<form onSubmit={form.handleSubmit(submitFunction)} className="space-y-4">
									<FormField
										name="email"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...field} placeholder="enter your email address" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" variant="default" size="lg" className="w-full" disabled={isPending}>
										{isPending ?
											(<><span>Sending request</span> <Loader className="w-4 h-4 animate-spin" /></>) :
											(<><span>Send request</span> <Send className="w-4 h-4" /></>)}
									</Button>
								</form>
							</Form>)
						}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default ForgotPassword