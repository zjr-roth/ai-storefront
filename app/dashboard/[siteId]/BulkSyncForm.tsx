"use client";

import { useState } from "react";

interface BulkSyncFormProps {
	siteId: string;
}

interface SyncResult {
	inserted: number;
	updated: number;
	unchanged: number;
	errors: number;
	total: number;
}

export default function BulkSyncForm({ siteId }: BulkSyncFormProps) {
	const [feedUrl, setFeedUrl] = useState("");
	const [sitemapUrl, setSitemapUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<SyncResult | null>(null);
	const [progress, setProgress] = useState(0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!feedUrl && !sitemapUrl) {
			setError("Please provide at least one URL (Feed or Sitemap)");
			return;
		}

		setIsLoading(true);
		setError(null);
		setResult(null);
		setProgress(0);

		try {
			// Start progress simulation
			const progressInterval = setInterval(() => {
				setProgress((prevProgress) => {
					// Increase by a random amount but never reach 100%
					const newProgress = Math.min(
						prevProgress + Math.random() * 10,
						95
					);
					return newProgress;
				});
			}, 1000);

			const response = await fetch("/api/bulk-sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					site_id: siteId,
					feed_url: feedUrl || undefined,
					sitemap_url: sitemapUrl || undefined,
				}),
			});

			clearInterval(progressInterval);
			setProgress(100);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `Error: ${response.status}`);
			}

			const data = await response.json();
			setResult(data);

			// Show toast notification
			showToast("Sync completed successfully!");
		} catch (err: any) {
			setError(err.message || "An unknown error occurred");
			showToast("Sync failed: " + (err.message || "Unknown error"), true);
		} finally {
			setIsLoading(false);
			// Reset progress after a delay
			setTimeout(() => setProgress(0), 3000);
		}
	};

	// Simple toast notification
	const showToast = (message: string, isError = false) => {
		const toast = document.createElement("div");
		toast.className = `fixed top-4 right-4 p-4 rounded-md text-white ${
			isError ? "bg-red-500" : "bg-green-500"
		} shadow-lg z-50 transition-opacity duration-500`;
		toast.textContent = message;
		document.body.appendChild(toast);

		// Remove after 3 seconds
		setTimeout(() => {
			toast.style.opacity = "0";
			setTimeout(() => {
				document.body.removeChild(toast);
			}, 500);
		}, 3000);
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-medium text-gray-900">
					Bulk Sync Products
				</h2>
				<p className="mt-1 text-sm text-gray-500">
					Import multiple products at once from a product feed JSON or
					a sitemap
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Product Feed URL
							<span className="text-xs text-gray-500 ml-2">
								(Shopify JSON or compatible)
							</span>
						</label>
						<input
							type="url"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							placeholder="https://yourstore.myshopify.com/products.json?limit=250"
							value={feedUrl}
							onChange={(e) => setFeedUrl(e.target.value)}
						/>
						<p className="mt-1 text-xs text-gray-500">
							Expects Shopify JSON format or array of products
							with title, price, etc.
						</p>
					</div>

					<div className="relative">
						<div
							className="absolute inset-0 flex items-center"
							aria-hidden="true"
						>
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center">
							<span className="bg-white px-3 text-sm text-gray-500">
								or
							</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Sitemap URL
							<span className="text-xs text-gray-500 ml-2">
								(Optional)
							</span>
						</label>
						<input
							type="url"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							placeholder="https://yourstore.com/sitemap.xml"
							value={sitemapUrl}
							onChange={(e) => setSitemapUrl(e.target.value)}
						/>
						<p className="mt-1 text-xs text-gray-500">
							We'll crawl links containing /products/ and fetch
							JSON data
						</p>
					</div>
				</div>

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				{result && (
					<div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-green-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-green-800">
									Sync completed successfully
								</h3>
								<div className="mt-2 text-sm text-green-700">
									<ul className="list-disc space-y-1 pl-5">
										<li>
											Products Added:{" "}
											<span className="font-medium">
												{result.inserted}
											</span>
										</li>
										<li>
											Products Updated:{" "}
											<span className="font-medium">
												{result.updated}
											</span>
										</li>
										<li>
											Products Unchanged:{" "}
											<span className="font-medium">
												{result.unchanged}
											</span>
										</li>
										{result.errors > 0 && (
											<li className="text-amber-600">
												Errors:{" "}
												<span className="font-medium">
													{result.errors}
												</span>
											</li>
										)}
										<li className="font-medium">
											Total Processed:{" "}
											<span className="font-medium">
												{result.total}
											</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				)}

				<div>
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
							isLoading ? "opacity-75 cursor-not-allowed" : ""
						}`}
					>
						{isLoading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Syncing Products...
							</>
						) : (
							"Sync Products"
						)}
					</button>
				</div>
			</form>

			{isLoading && (
				<div className="mt-4">
					<h4 className="text-sm font-medium text-gray-700 mb-1">
						Sync Progress
					</h4>
					<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<p className="text-xs text-center mt-1 text-gray-500">
						Syncing products. This might take a few minutes...
					</p>
				</div>
			)}

			<div className="rounded-md bg-blue-50 p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg
							className="h-5 w-5 text-blue-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3 flex-1 md:flex md:justify-between">
						<p className="text-sm text-blue-700">
							For Shopify stores, use {"{"}baseUrl{"}"}
							/products.json?limit=250 for the feed URL.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
