"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface SiteStatusCardProps {
	siteId: string;
}

interface SiteStatus {
	manifest_valid: boolean;
	products_count: number;
	missing_schema: boolean;
	last_manifest_fetch: string | null;
}

export default function SiteStatusCard({ siteId }: SiteStatusCardProps) {
	const [status, setStatus] = useState<SiteStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchSiteStatus() {
			try {
				const response = await fetch(`/api/site-status/${siteId}`);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || `Error: ${response.status}`
					);
				}

				const data = await response.json();
				setStatus(data);
			} catch (err: any) {
				setError(err.message || "An unknown error occurred");
				console.error("Failed to fetch site status:", err);
			} finally {
				setLoading(false);
			}
		}

		if (siteId) {
			fetchSiteStatus();
		}
	}, [siteId]);

	if (loading) {
		return (
			<div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-6 animate-pulse">
				<div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
				<div className="h-4 bg-gray-200 rounded w-1/2"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
				<h3 className="text-red-700 font-medium">Error</h3>
				<p className="text-red-600 text-sm">{error}</p>
			</div>
		);
	}

	if (!status) {
		return null;
	}

	return (
		<div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-6">
			<h2 className="text-lg text-black font-medium mb-3">Site Status</h2>

			<div className="grid grid-cols-2 gap-3 mb-2">
				<div>
					<div className="flex items-center gap-2">
						<span
							className={`inline-flex items-center  justify-center w-5 h-5 rounded-full ${
								status.manifest_valid
									? "bg-green-100 text-green-600"
									: "bg-red-100 text-red-600"
							}`}
						>
							{status.manifest_valid ? "✓" : "✗"}
						</span>
						<span className="text-sm text-black font-medium">
							Manifest
						</span>
					</div>
					<p className="text-xs text-gray-500 ml-7">
						{status.manifest_valid ? "Valid" : "Missing or invalid"}
					</p>
				</div>

				<div>
					<div className="flex items-center gap-2">
						<span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
							{status.products_count}
						</span>
						<span className="text-sm text-black font-medium">
							Products
						</span>
					</div>
					<p className="text-xs text-gray-500 ml-7">
						{status.products_count > 0
							? "Injected"
							: "No products in database"}
					</p>
				</div>
			</div>

			<div className="mt-4 pt-3 border-t border-gray-100">
				{status.missing_schema && (
					<div className="flex items-center gap-2 mb-2 text-amber-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M7.86 2h.28c.53 0 1.01 0 1.4.07.4.08.75.23 1.03.51.28.28.43.63.5 1.03.08.39.08.87.08 1.4v5.99c0 .53 0 1.01-.07 1.4-.08.4-.23.75-.51 1.03-.28.28-.63.43-1.03.5-.39.08-.87.08-1.4.08h-.28c-.53 0-1.01 0-1.4-.07-.4-.08-.75-.23-1.03-.51-.28-.28-.43-.63-.5-1.03-.08-.39-.08-.87-.08-1.4V4.99c0-.53 0-1.01.07-1.4.08-.4.23-.75.51-1.03.28-.28.63-.43 1.03-.5.39-.08.87-.08 1.4-.08Z"></path>
							<path d="M8 12h.01"></path>
						</svg>
						<span className="text-xs">
							Missing schema on homepage
						</span>
					</div>
				)}

				<div className="flex items-center gap-2 text-gray-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					<span className="text-xs">
						{status.last_manifest_fetch
							? `Last seen ${formatDistanceToNow(
									new Date(status.last_manifest_fetch)
							  )} ago`
							: "Never seen by agent"}
					</span>
				</div>
			</div>
		</div>
	);
}
