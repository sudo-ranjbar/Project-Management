import { resetPasswordSchema } from "@/lib/schema";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2, Send } from "lucide-react";
import { Link } from "react-router"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useResetPasswordMutation } from "@/hooks/auth";
import { toast } from "sonner";


type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
	const [isSuccess, setIsSuccess] = useState(false);
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const form = useForm<resetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: ""
		}
	})

	const { mutate, isPending } = useResetPasswordMutation();

	// submit function
	const submitFunction: SubmitHandler<resetPasswordFormData> = (formData: resetPasswordFormData) => {
		if (!token) {
			toast.error("Token Not Found!");
			return
		}
		mutate({ ...formData, token: token as string }, {
			onSuccess: (data: any) => {
				setIsSuccess(true);
				toast.success(data.message);
			},
			onError: (error: any) => {
				toast.error(error.response?.data?.message);
				console.log(error);
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
								<CheckCircle className="w-10 h-10 text-green-500" />
								<h1 className="text-2xl font-bold">Password Reset Successful.</h1>
							</div>) :
							(<Form {...form}>
								<form onSubmit={form.handleSubmit(submitFunction)} className="space-y-4">
									<FormField
										name="newPassword"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input {...field} placeholder="enter your new password" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="confirmPassword"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input {...field} placeholder="please repeate your password" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" variant="default" size="lg" className="w-full" disabled={isPending}>
										{isPending ?
											(<><span>Sending request</span> <Loader2 className="w-4 h-4 animate-spin" /></>) :
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

export default ResetPassword