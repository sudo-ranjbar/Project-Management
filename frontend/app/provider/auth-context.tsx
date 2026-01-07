import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types';
import { queryClient } from './react-query-provider';
import { useLocation, useNavigate } from 'react-router';
import { publicRoutes } from '@/lib';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoadingUser: boolean;
	login: (data: any) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoadingUser, setIsLoadingUser] = useState(true)

	const navigate = useNavigate();
	const currentPath = useLocation().pathname;
	const isPublicRoute = publicRoutes.includes(currentPath);

	// check if user is authenticated
	useEffect(() => {
		const checkAuth = async () => {
			// setIsLoadingUser(true);

			const userInfo = localStorage.getItem("user");

			if (userInfo) {
				setUser(JSON.parse(userInfo));
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
				if (!isPublicRoute) {
					navigate("/sign-in", { replace: true });
				}
			}
			setIsLoadingUser(false);
		}
		checkAuth();
	}, [currentPath]);

	// force logout handler
	useEffect(() => {
		const handleLogout = () => {
			logout();
		}
		window.addEventListener("force-logout", handleLogout);
		return () => window.removeEventListener("force-logout", handleLogout);
	},[])

	const login = async (data: any) => {
		localStorage.setItem("token", data.token);
		localStorage.setItem("user", JSON.stringify(data.user));
		setUser(data.user);
		setIsAuthenticated(true);
	}

	const logout = async () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setIsAuthenticated(false);
		queryClient.clear();
		navigate("/sign-in")
	}

	return (
		<AuthContext value={{ user, isAuthenticated, isLoadingUser, login, logout }}>
			{children}
		</AuthContext>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}