"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();
	const [siteId, setSiteId] = useState<string | null>(null);

	// Extract siteId from the URL
	useEffect(() => {
		const pathParts = pathname.split("/");
		const potentialSiteId = pathParts.length > 2 ? pathParts[2] : null;

		if (potentialSiteId && potentialSiteId !== "[siteId]") {
			setSiteId(potentialSiteId);
		}
	}, [pathname]);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{siteId && <Navbar siteId={siteId} />}

			<main className="flex-1">{children}</main>

			<footer className="bg-white border-t border-gray-200 py-4">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center">
						<p className="text-sm text-gray-500">
							&copy; {new Date().getFullYear()} AI Storefront. All
							rights reserved.
						</p>
						<div className="flex space-x-6">
							<Link
								href="/docs"
								className="text-sm text-gray-500 hover:text-gray-900"
							>
								Documentation
							</Link>
							<Link
								href="/help"
								className="text-sm text-gray-500 hover:text-gray-900"
							>
								Help Center
							</Link>
							<Link
								href="/privacy"
								className="text-sm text-gray-500 hover:text-gray-900"
							>
								Privacy
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
