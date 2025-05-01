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
				setLoading(true);
				const response = await fetch(`/api/site-status/${siteId}`);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || `Error: ${response.status}`
					);
				}

				const data = await response.json();
				setStatus(data);
				setError(null);
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
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
				<div className="h-6 bg-gray-200 rounded-full w-1/3 mb-4"></div>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div>
						<div className="h-4 bg-gray-200 rounded-full w-2/3 mb-2"></div>
						<div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
					</div>
					<div>
						<div className="h-4 bg-gray-200 rounded-full w-2/3 mb-2"></div>
						<div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
					</div>
				</div>
				<div className="h-10 bg-gray-200 rounded w-full"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 rounded-lg border border-red-200 p-6">
				<div className="flex items-center">
					<svg
						className="h-6 w-6 text-red-600 mr-3"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-red-800">
						Error Loading Site Status
					</h3>
				</div>
				<div className="mt-2">
					<p className="text-sm text-red-700">{error}</p>
				</div>
				<div className="mt-4">
					<button
						onClick={() => window.location.reload()}
						className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					>
						Refresh Page
					</button>
				</div>
			</div>
		);
	}

	if (!status) {
		return null;
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div className="p-6">
				<h2 className="text-lg font-medium text-gray-900 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 text-blue-500 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
					Site Status
				</h2>

				<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								{status.manifest_valid ? (
									<span className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
										<svg
											className="h-6 w-6 text-green-600"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</span>
								) : (
									<span className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
										<svg
											className="h-6 w-6 text-red-600"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</span>
								)}
							</div>
							<div className="ml-4">
								<h3 className="text-lg font-medium text-gray-900">
									Manifest
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									{status.manifest_valid
										? "Valid and accessible"
										: "Missing or invalid"}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
									<svg
										className="h-6 w-6 text-blue-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										/>
									</svg>
								</span>
							</div>
							<div className="ml-4">
								<h3 className="text-lg font-medium text-gray-900">
									Products
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									{status.products_count} products in database
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
					<h3 className="text-sm font-medium text-gray-700">
						Details
					</h3>

					<div className="mt-4 space-y-4">
						{status.missing_schema && (
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-amber-500"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
											clipRule="evenodd"
										/>
										<path d="M10 14a1 1 0 100-2 1 1 0 000 2zm0-10a1 1 0 00-1 1v5a1 1 0 002 0V5a1 1 0 00-1-1z" />
									</svg>
								</div>
								<div className="ml-3">
									<h4 className="text-sm font-medium text-amber-800">
										Schema Warning
									</h4>
									<p className="mt-1 text-xs text-amber-700">
										Missing schema markup on homepage. AI
										agents may have difficulty understanding
										your products.
									</p>
								</div>
							</div>
						)}

						<div className="flex items-start">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h4 className="text-sm font-medium text-gray-900">
									Last Agent Interaction
								</h4>
								<p className="mt-1 text-xs text-gray-500">
									{status.last_manifest_fetch
										? `Last seen ${formatDistanceToNow(
												new Date(
													status.last_manifest_fetch
												)
										  )} ago`
										: "Never seen by agent"}
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
								</svg>
							</div>
							<div className="ml-3">
								<h4 className="text-sm font-medium text-gray-900">
									Quick Tip
								</h4>
								<p className="mt-1 text-xs text-gray-500">
									Ensure your products have detailed
									descriptions, accurate pricing, and
									high-quality images for best AI performance.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
