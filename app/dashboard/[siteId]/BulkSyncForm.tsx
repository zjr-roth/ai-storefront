// app/dashboard/[siteId]/BulkSyncForm.tsx
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!feedUrl && !sitemapUrl) {
			setError("Please provide at least one URL (Feed or Sitemap)");
			return;
		}

		setIsLoading(true);
		setError(null);
		setResult(null);

		try {
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
		<div className="mt-8 p-6 border rounded-md">
			<h2 className="text-lg font-semibold mb-4">Bulk Sync Products</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Product Feed URL
						<span className="text-xs text-gray-500 ml-2">
							(Shopify JSON or compatible)
						</span>
					</label>
					<input
						type="url"
						className="border p-2 w-full rounded"
						placeholder="https://yourstore.myshopify.com/products.json?limit=250"
						value={feedUrl}
						onChange={(e) => setFeedUrl(e.target.value)}
					/>
					<p className="text-xs text-gray-500 mt-1">
						Expects Shopify JSON format or array of products with
						title, price, etc.
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Sitemap URL
						<span className="text-xs text-gray-500 ml-2">
							(Optional)
						</span>
					</label>
					<input
						type="url"
						className="border p-2 w-full rounded"
						placeholder="https://yourstore.com/sitemap.xml"
						value={sitemapUrl}
						onChange={(e) => setSitemapUrl(e.target.value)}
					/>
					<p className="text-xs text-gray-500 mt-1">
						We'll crawl links containing /products/ and fetch JSON
						data
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 p-3 rounded text-red-600 text-sm">
						{error}
					</div>
				)}

				{result && (
					<div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
						<h3 className="font-medium text-green-700">
							Sync Results:
						</h3>
						<ul className="mt-1 text-gray-700">
							<li>Products Added: {result.inserted}</li>
							<li>Products Updated: {result.updated}</li>
							<li>Products Unchanged: {result.unchanged}</li>
							{result.errors > 0 && (
								<li className="text-amber-600">
									Errors: {result.errors}
								</li>
							)}
							<li className="font-medium mt-1">
								Total Processed: {result.total}
							</li>
						</ul>
					</div>
				)}

				<button
					type="submit"
					disabled={isLoading}
					className={`bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 ${
						isLoading ? "cursor-wait" : ""
					}`}
				>
					{isLoading ? (
						<>
							<span className="inline-block animate-spin mr-2">
								↻
							</span>
							Syncing Products...
						</>
					) : (
						"Sync Products"
					)}
				</button>
			</form>

			{isLoading && (
				<div className="mt-4">
					<div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
						<div className="h-full bg-green-500 animate-pulse rounded"></div>
					</div>
					<p className="text-xs text-center mt-1 text-gray-500">
						Syncing products. This might take a few minutes...
					</p>
				</div>
			)}
		</div>
	);
}
