import { useAuth } from '@/provider/auth-context'
import { Navigate, Outlet } from 'react-router'

const AuthLayout = () => {
	const { isAuthenticated, isLoadingUser } = useAuth()

	if (isLoadingUser) {
		return <div>Loading fetching usr...</div>
	}

	if (isAuthenticated) {
		return <Navigate to="/dashboard" />
	}
	return (
		<Outlet />
	)
}

export default AuthLayout