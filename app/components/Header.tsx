import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<div className="flex items-center">
						<div className="text-2xl font-bold text-blue-600">
							AI Storefront
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Link
							href="/login"
							className="text-sm text-gray-700 hover:text-gray-900"
						>
							Log in
						</Link>
						<Link
							href="/signup"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
