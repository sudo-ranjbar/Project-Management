import { postData } from "@/lib/fetch-util"
import type { forgotPasswordFormData } from "@/routes/auth/forgot-password"
import type { SignUpFormData } from "@/routes/auth/sign-up"
import { useMutation } from "@tanstack/react-query"

export const useSignUpMutation = () => {
	return useMutation({
		mutationFn: (data: SignUpFormData) => postData("/auth/register", data)
	})
}

export const useVerifyEmailMutation = () => {
	return useMutation({
		mutationFn: (data: { token: string }) => postData("/auth/verify-email", data),
	});
};

export const useSignInMutation = () => {
	return useMutation({
		mutationFn: (data: { email: string, password: string }) => postData("/auth/login", data)
	})
}

// forgot password mutation hook
export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: (data: forgotPasswordFormData) => postData("auth/reset-password-request", data)
	})
}

// reset password mutation hook
export const useResetPasswordMutation = () => {
	return useMutation({
		mutationFn: (data: { token: string; newPassword: string; confirmPassword: string; }) => postData("auth/reset-password", data)
	})
}