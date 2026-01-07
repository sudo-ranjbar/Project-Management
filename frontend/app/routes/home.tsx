import { Button } from "@/components/ui/button";
import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "project management" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div className="w-full h-screen p-5">
			<h1>hello there!</h1>
			<Link to="/sign-in">
				<Button>Sign in</Button>
			</Link>
			<Link to="/sign-up">
				<Button variant="outline">Sign up</Button>
			</Link>
		</div>
	)
}
