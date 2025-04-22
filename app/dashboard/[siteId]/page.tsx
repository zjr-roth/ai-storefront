// app/dashboard/[siteId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, ChangeEvent } from "react";
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
		</div>
	);
}
