"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
	siteId: string;
}

export default function Navbar({ siteId }: NavbarProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const isActive = (path: string) => {
		return pathname.includes(path);
	};

	return (
		<nav className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<span className="text-xl font-bold text-blue-600">
								AI Storefront
							</span>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								href={`/dashboard/${siteId}`}
								className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									isActive("/dashboard") &&
									!isActive("/analytics") &&
									!isActive("/settings")
										? "border-blue-500 text-gray-900"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
								}`}
							>
								Dashboard
							</Link>
							<Link
								href={`/dashboard/${siteId}/analytics`}
								className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									isActive("/analytics")
										? "border-blue-500 text-gray-900"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
								}`}
							>
								Analytics
							</Link>
							<Link
								href={`/dashboard/${siteId}/settings`}
								className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									isActive("/settings")
										? "border-blue-500 text-gray-900"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
								}`}
							>
								Settings
							</Link>
						</div>
					</div>
					<div className="hidden sm:ml-6 sm:flex sm:items-center">
						<button
							type="button"
							className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<span className="sr-only">View notifications</span>
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
						</button>

						{/* Profile dropdown */}
						<div className="ml-3 relative">
							<div>
								<button
									type="button"
									className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									id="user-menu-button"
									aria-expanded="false"
									aria-haspopup="true"
								>
									<span className="sr-only">
										Open user menu
									</span>
									<div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
										AS
									</div>
								</button>
							</div>
						</div>
					</div>
					<div className="-mr-2 flex items-center sm:hidden">
						{/* Mobile menu button */}
						<button
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							type="button"
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							{isMobileMenuOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu, show/hide based on menu state */}
			{isMobileMenuOpen && (
				<div className="sm:hidden" id="mobile-menu">
					<div className="pt-2 pb-3 space-y-1">
						<Link
							href={`/dashboard/${siteId}`}
							className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								isActive("/dashboard") &&
								!isActive("/analytics") &&
								!isActive("/settings")
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
							}`}
						>
							Dashboard
						</Link>
						<Link
							href={`/dashboard/${siteId}/analytics`}
							className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								isActive("/analytics")
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
							}`}
						>
							Analytics
						</Link>
						<Link
							href={`/dashboard/${siteId}/settings`}
							className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								isActive("/settings")
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
							}`}
						>
							Settings
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
