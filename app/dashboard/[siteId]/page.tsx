"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import BulkSyncForm from "./BulkSyncForm";
import SiteStatusCard from "./SiteStatusCard";
import StoreAnalytics from "./StoreAnalytics";
import Navbar from "@/app/components/Navbar";

interface ProductForm {
	title: string;
	price: string;
	image_url: string;
	buy_url: string;
	description: string;
}

export default function Dashboard() {
	const supabase = createClientComponentClient();
	const params = useParams();

	// If the siteId is in the URL params, use that; otherwise, retrieve from localStorage/registration
	const [siteId, setSiteId] = useState<string | null>(
		(params.siteId as string) || null
	);
	const [activeTab, setActiveTab] = useState<"add" | "bulk">("add");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loadingProducts, setLoadingProducts] = useState(true);

	const [form, setForm] = useState<ProductForm>({
		title: "",
		price: "",
		image_url: `https://picsum.photos/seed/${Math.floor(
			Math.random() * 1000
		)}/400/400`,
		buy_url: "",
		description: "",
	});
	const [products, setProducts] = useState<any[]>([]);

	// 🔁 Auto-register site on load if siteId not in params
	useEffect(() => {
		const registerSiteIfNeeded = async () => {
			// If siteId already exists from params, skip registration
			if (siteId) return;

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const domain = window.location.hostname;

			if (!user) return;

			// Check if this site already exists
			const { data: existingSite, error: fetchError } = await supabase
				.from("sites")
				.select("id")
				.eq("domain", domain)
				.single();

			if (existingSite) {
				setSiteId(existingSite.id);
			} else {
				const { data: newSite, error: insertError } = await supabase
					.from("sites")
					.insert({
						domain,
						user_id: user.id,
					})
					.select()
					.single();

				if (insertError) {
					console.error("Site insert failed:", insertError.message);
					return;
				}

				setSiteId(newSite.id);
			}
		};

		registerSiteIfNeeded();
	}, []);

	// 🔁 Once siteId is ready, fetch products
	useEffect(() => {
		if (!siteId) return;

		const fetchProducts = async () => {
			setLoadingProducts(true);
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.eq("site_id", siteId)
				.order("created_at", { ascending: false });

			if (error) console.error("Error fetching products:", error);
			else setProducts(data || []);

			setLoadingProducts(false);
		};

		fetchProducts();
	}, [siteId]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async () => {
		if (!form.title || !form.price) {
			alert("Title and price are required fields");
			return;
		}

		setIsSubmitting(true);

		try {
			const { error } = await supabase.from("products").insert({
				...form,
				price: parseFloat(form.price),
				site_id: siteId,
			});

			if (error) {
				alert("Error saving product: " + error.message);
			} else {
				// Reset form
				setForm({
					title: "",
					price: "",
					image_url: `https://picsum.photos/seed/${Math.floor(
						Math.random() * 1000
					)}/400/400`,
					buy_url: "",
					description: "",
				});

				// Show success toast
				showToast("Product added successfully!", false);

				// Refresh product list
				const { data } = await supabase
					.from("products")
					.select("*")
					.eq("site_id", siteId)
					.order("created_at", { ascending: false });

				if (data) setProducts(data);
			}
		} catch (err) {
			console.error("Error submitting product:", err);
			alert("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Function to refresh products list
	const refreshProducts = async () => {
		if (!siteId) return;

		setLoadingProducts(true);
		const { data, error } = await supabase
			.from("products")
			.select("*")
			.eq("site_id", siteId)
			.order("created_at", { ascending: false });

		if (error) console.error("Error fetching products:", error);
		else setProducts(data || []);

		setLoadingProducts(false);
		showToast("Products refreshed", false);
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

	if (!siteId) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full p-6">
					<div className="text-center">
						<svg
							className="mx-auto h-12 w-12 text-gray-400 animate-spin"
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
						<h2 className="mt-2 text-lg font-medium text-gray-900">
							Initializing...
						</h2>
						<p className="mt-1 text-sm text-gray-500">
							Setting up your AI Storefront
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="dashboard-container py-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Products Dashboard
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Manage your AI-ready product catalog
						</p>
					</div>
					<div className="mt-4 md:mt-0">
						<button
							onClick={refreshProducts}
							className="button-secondary ml-2"
						>
							Refresh Data
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left column - Status & Forms */}
					<div className="lg:col-span-2 space-y-6">
						{/* Site Status */}
						<SiteStatusCard siteId={siteId} />

						{/* Tab Navigation */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
							<div className="border-b border-gray-200">
								<nav className="flex -mb-px">
									<button
										onClick={() => setActiveTab("add")}
										className={`px-6 py-3 text-sm font-medium ${
											activeTab === "add"
												? "tab-active"
												: "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
										}`}
									>
										Add Product
									</button>
									<button
										onClick={() => setActiveTab("bulk")}
										className={`px-6 py-3 text-sm font-medium ${
											activeTab === "bulk"
												? "tab-active"
												: "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
										}`}
									>
										Bulk Sync
									</button>
								</nav>
							</div>

							<div className="p-6">
								{/* Tab Content */}
								{activeTab === "add" ? (
									/* Add Product Form */
									<div className="space-y-4">
										<h2 className="text-lg font-medium text-gray-900">
											Add New Product
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="title"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Product Title{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<input
													id="title"
													name="title"
													value={form.title}
													onChange={handleChange}
													placeholder="e.g. Premium Leather Wallet"
													className="input"
													required
												/>
											</div>
											<div>
												<label
													htmlFor="price"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Price{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<input
													id="price"
													name="price"
													type="number"
													min="0"
													step="0.01"
													value={form.price}
													onChange={handleChange}
													placeholder="29.99"
													className="input"
													required
												/>
											</div>
											<div>
												<label
													htmlFor="image_url"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Image URL
												</label>
												<input
													id="image_url"
													name="image_url"
													value={form.image_url}
													onChange={handleChange}
													placeholder="https://example.com/image.jpg"
													className="input"
												/>
											</div>
											<div>
												<label
													htmlFor="buy_url"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Buy URL
												</label>
												<input
													id="buy_url"
													name="buy_url"
													value={form.buy_url}
													onChange={handleChange}
													placeholder="https://example.com/products/buy"
													className="input"
												/>
											</div>
											<div className="md:col-span-2">
												<label
													htmlFor="description"
													className="block text-sm font-medium text-gray-700 mb-1"
												>
													Description
												</label>
												<textarea
													id="description"
													name="description"
													value={form.description}
													onChange={handleChange}
													placeholder="Product description"
													className="input min-h-[100px]"
													rows={4}
												/>
											</div>
										</div>

										<div className="pt-4">
											<button
												onClick={handleSubmit}
												disabled={isSubmitting}
												className={`button-primary w-full md:w-auto ${
													isSubmitting
														? "opacity-70 cursor-not-allowed"
														: ""
												}`}
											>
												{isSubmitting ? (
													<>
														<svg
															className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
														Saving...
													</>
												) : (
													"Save Product"
												)}
											</button>
										</div>
									</div>
								) : (
									/* Bulk Sync Form */
									<BulkSyncForm siteId={siteId} />
								)}
							</div>
						</div>
					</div>

					{/* Right column - Store Analytics Summary */}
					<div className="space-y-6">
						<StoreAnalytics siteId={siteId} timeRange="7days" />
					</div>
				</div>

				{/* Products List */}
				<div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
						<h2 className="text-lg font-medium text-gray-900">
							Products ({products.length})
						</h2>
						<div className="flex space-x-2">
							<button
								onClick={refreshProducts}
								className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
								disabled={loadingProducts}
							>
								{loadingProducts ? (
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
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
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 mr-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
								)}
								{loadingProducts ? "Refreshing..." : "Refresh"}
							</button>
						</div>
					</div>

					{loadingProducts ? (
						<div className="p-6 text-center">
							<svg
								className="animate-spin h-8 w-8 text-gray-400 mx-auto"
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
							<p className="mt-2 text-sm text-gray-500">
								Loading products...
							</p>
						</div>
					) : products.length === 0 ? (
						<div className="p-6 text-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-gray-400 mx-auto"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
							<p className="mt-2 text-gray-500">
								No products added yet
							</p>
							<p className="text-sm text-gray-400">
								Add products individually or use Bulk Sync
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
							{products.map((product) => (
								<div
									key={product.id}
									className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
								>
									<div className="aspect-w-16 aspect-h-9 bg-gray-200">
										{product.image_url ? (
											<img
												src={product.image_url}
												alt={product.title}
												className="w-full h-40 object-cover"
												onError={(e) => {
													(
														e.target as HTMLImageElement
													).src =
														"https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
												}}
											/>
										) : (
											<div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400">
												No image
											</div>
										)}
									</div>
									<div className="p-4">
										<h3 className="text-md font-medium text-gray-900 truncate">
											{product.title}
										</h3>
										<div className="mt-1 flex items-center">
											<span className="text-sm font-semibold text-gray-900">
												$
												{parseFloat(
													product.price
												).toFixed(2)}
											</span>
											{product.buy_url && (
												<a
													href={product.buy_url}
													target="_blank"
													rel="noopener noreferrer"
													className="ml-auto text-xs text-blue-600 hover:text-blue-800"
												>
													View Buy Page
												</a>
											)}
										</div>
										{product.description && (
											<p className="mt-2 text-sm text-gray-500 line-clamp-2">
												{product.description}
											</p>
										)}
										<div className="mt-3 text-xs text-gray-400">
											Added:{" "}
											{new Date(
												product.created_at
											).toLocaleDateString()}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
