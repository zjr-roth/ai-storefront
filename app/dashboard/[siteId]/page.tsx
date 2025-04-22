// app/dashboard/[siteId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { supabase } from "@/lib/supabase";
interface ProductForm {
	title: string;
	price: string;
	image_url: string;
	buy_url: string;
	description: string;
}

export default function Dashboard() {
	const params = useParams(); // ✅ Fix: use the hook
	const siteId = params?.siteId as string; // or: decodeURIComponent(params?.siteId)

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

	useEffect(() => {
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
		else alert("Product saved!");
	};

	return (
		<div className="p-8 max-w-xl mx-auto">
			<h1 className="text-xl font-bold mb-4">Add Product</h1>
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
			<div className="mt-8">
				<h2 className="text-lg font-semibold mb-4">Saved Products</h2>
				{products.map((product) => (
					<div key={product.id} className="mb-6 border-b pb-4">
						<img
							src={product.image_url}
							alt={product.title}
							className="w-32 h-32 object-cover mb-2"
						/>
						<h3 className="text-md font-bold">{product.title}</h3>
						<p className="text-sm text-gray-600">
							${product.price}
						</p>
						<p className="text-sm">{product.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
