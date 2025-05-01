export default function TestimonialsSection() {
	return (
		<div className="bg-white py-16 lg:py-24">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative">
					<h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
						Trusted by e-commerce businesses
					</h2>
					<p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
						See what store owners are saying about our AI Storefront
						solution
					</p>
				</div>

				<div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
					<TestimonialCard
						role="Shopify Store Owner"
						name="Sarah Johnson"
						quote="Since using AI Storefront, I've seen a 30% increase in traffic from customers who found my products through AI assistants."
						store="BeautyEssentials.com"
						initials="SJ"
					/>
					<TestimonialCard
						role="WooCommerce Store Owner"
						name="Michael Chen"
						quote="The analytics dashboard gives me incredible insights into how AI agents are recommending my products. It's changed how I optimize my product descriptions."
						store="TechGadgetPro.com"
						initials="MC"
					/>
					<TestimonialCard
						role="Custom Store Owner"
						name="Alexandra Rivera"
						quote="Setup took less than 10 minutes and I immediately started seeing AI agents recommending my handmade products. The ROI has been incredible."
						store="HandcraftedJewelry.co"
						initials="AR"
					/>
				</div>
			</div>
		</div>
	);
}

interface TestimonialCardProps {
	role: string;
	name: string;
	quote: string;
	store: string;
	initials: string;
}

function TestimonialCard({
	role,
	name,
	quote,
	store,
	initials,
}: TestimonialCardProps) {
	return (
		<div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
			<div className="flex-1 bg-white p-6 flex flex-col justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-blue-600">{role}</p>
					<div className="block mt-2">
						<p className="text-xl font-semibold text-gray-900">
							{name}
						</p>
						<p className="mt-3 text-base text-gray-500">
							"{quote}"
						</p>
					</div>
				</div>
				<div className="mt-6 flex items-center">
					<div className="flex-shrink-0">
						<span className="sr-only">{name}</span>
						<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
							<span className="text-blue-600 font-semibold">
								{initials}
							</span>
						</div>
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-900">
							{store}
						</p>
						<div className="flex space-x-1 text-sm text-yellow-500">
							{[...Array(5)].map((_, i) => (
								<svg
									key={i}
									className="h-4 w-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
