"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import BulkSyncForm from "./BulkSyncForm";
import { useParams } from "next/navigation";
import SiteStatusCard from "./SiteStatusCard";
import StoreAnalytics from "./StoreAnalytics";

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
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.eq("site_id", siteId);

			if (error) console.error("Error fetching products:", error);
			else setProducts(data);
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
		const { error } = await supabase.from("products").insert({
			...form,
			price: parseFloat(form.price),
			site_id: siteId,
		});

		if (error) alert("Error saving product: " + error.message);
		else {
			alert("Product saved!");

			// Refresh product list
			const { data } = await supabase
				.from("products")
				.select("*")
				.eq("site_id", siteId);

			if (data) setProducts(data);
		}
	};

	// Function to refresh products list
	const refreshProducts = async () => {
		if (!siteId) return;

		const { data, error } = await supabase
			.from("products")
			.select("*")
			.eq("site_id", siteId);

		if (error) console.error("Error fetching products:", error);
		else setProducts(data);
	};

	// Debug info for development
	console.log("Current siteId:", siteId);
	console.log("Active tab:", activeTab);

	return (
		<div className="p-8 max-w-xl mx-auto">
			<h1 className="text-xl font-bold mb-4">Products Dashboard</h1>

			{/* Site Status */}
			{siteId && <SiteStatusCard siteId={siteId} />}

			{/* Store Analytics */}
			{siteId && <StoreAnalytics siteId={siteId} />}

			{/* Tab Navigation */}
			<div className="flex border-b mb-6">
				<button
					onClick={() => setActiveTab("add")}
					className={`py-2 px-4 ${
						activeTab === "add"
							? "border-b-2 border-black font-medium"
							: "text-gray-500"
					}`}
				>
					Add Product
				</button>
				<button
					onClick={() => setActiveTab("bulk")}
					className={`py-2 px-4 ${
						activeTab === "bulk"
							? "border-b-2 border-black font-medium"
							: "text-gray-500"
					}`}
				>
					Bulk Sync
				</button>
			</div>

			{/* Tab Content */}
			{activeTab === "add" ? (
				/* Add Product Form - existing code */
				<>
					<input
						name="title"
						onChange={handleChange}
						placeholder="Title"
						className="border p-2 w-full mb-2"
					/>
					<input
						name="price"
						onChange={handleChange}
						placeholder="Price"
						className="border p-2 w-full mb-2"
					/>
					<input
						name="image_url"
						onChange={handleChange}
						placeholder="Image URL"
						className="border p-2 w-full mb-2"
						value={form.image_url}
					/>
					<input
						name="buy_url"
						onChange={handleChange}
						placeholder="Buy URL"
						className="border p-2 w-full mb-2"
					/>
					<textarea
						name="description"
						onChange={handleChange}
						placeholder="Description"
						className="border p-2 w-full mb-4"
					/>
					<button
						onClick={handleSubmit}
						className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
					>
						Save Product
					</button>
				</>
			) : /* Bulk Sync Form - new code */
			siteId ? (
				<BulkSyncForm siteId={siteId} />
			) : (
				<div className="text-gray-500">Loading site information...</div>
			)}

			{/* Products List - existing code */}
			<div className="mt-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold">Saved Products</h2>
					<button
						onClick={refreshProducts}
						className="text-sm text-gray-600 hover:text-black"
					>
						Refresh
					</button>
				</div>

				{products.length === 0 ? (
					<p className="text-gray-500 italic">No products yet</p>
				) : (
					products.map((product) => (
						<div key={product.id} className="mb-6 border-b pb-4">
							<img
								src={product.image_url}
								alt={product.title}
								className="w-32 h-32 object-cover mb-2"
							/>
							<h3 className="text-md font-bold">
								{product.title}
							</h3>
							<p className="text-sm text-gray-600">
								${product.price}
							</p>
							<p className="text-sm">{product.description}</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}
