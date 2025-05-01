import Link from "next/link";

export default function PricingSection() {
	return (
		<div className="bg-gray-100 py-16 lg:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Simple, transparent pricing
					</h2>
					<p className="mt-4 text-xl text-gray-600">
						No hidden fees. No long-term contracts. Start connecting
						to AI agents today.
					</p>
				</div>

				<div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-0">
					{/* Free Plan Column */}
					<div className="p-8 lg:p-12 flex flex-col">
						<div className="flex-grow">
							<h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
								Free Plan
							</h3>
							<p className="mt-6 text-base text-gray-500">
								Perfect for small stores just getting started
								with AI agent integration.
							</p>
							<div className="mt-8">
								<div className="flex items-center">
									<h4 className="flex-shrink-0 pr-4 text-sm font-semibold uppercase tracking-wider text-indigo-600">
										What's included
									</h4>
									<div className="flex-1 border-t border-gray-200"></div>
								</div>
								<ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-x-8 lg:gap-y-5">
									<PricingFeature text="Up to 50 products" />
									<PricingFeature text="Basic AI agent integration" />
									<PricingFeature text="Simple analytics dashboard" />
									<PricingFeature text="Email support" />
								</ul>
							</div>
						</div>
						<div className="mt-8">
							<div className="rounded-lg shadow-md">
								<Link
									href="/signup"
									className="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50"
									aria-describedby="tier-hobby"
								>
									Start for free
								</Link>
							</div>
						</div>
					</div>

					{/* Pro Plan Column */}
					<div className="py-8 px-6 bg-gray-50 lg:flex lg:flex-col lg:justify-between lg:p-12">
						<div className="flex-grow">
							<div className="text-center">
								<p className="text-lg leading-6 font-medium text-gray-900">
									Pro Plan
								</p>
								<div className="mt-4 flex items-center justify-center">
									<span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
										<span className="mt-2 mr-2 text-4xl font-medium">
											$
										</span>
										<span className="font-extrabold">
											49
										</span>
									</span>
									<span className="text-xl font-medium text-gray-500">
										/month
									</span>
								</div>
							</div>

							<div className="mt-4 max-w-xs mx-auto">
								<p className="text-sm text-gray-500 mb-6">
									For growing businesses looking to maximize
									AI potential
								</p>
								<ul className="space-y-4 text-left">
									<ProFeature text="Unlimited products" />
									<ProFeature text="Advanced AI integration" />
									<ProFeature text="Detailed analytics" />
									<ProFeature text="Conversion tracking" />
									<ProFeature text="Priority support" />
									<ProFeature text="Custom AI product descriptions" />
								</ul>
							</div>
						</div>
						<div className="mt-8">
							<div className="rounded-lg shadow-md">
								<Link
									href="/signup"
									className="block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-xl leading-6 font-medium text-white hover:bg-indigo-700"
									aria-describedby="tier-growth"
								>
									Start free trial
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function PricingFeature({ text }: { text: string }) {
	return (
		<li className="flex items-start lg:col-span-1">
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
			<p className="ml-3 text-sm text-gray-700">{text}</p>
		</li>
	);
}

function ProFeature({ text }: { text: string }) {
	return (
		<li className="flex items-start">
			<div className="flex-shrink-0">
				<svg
					className="h-6 w-6 text-indigo-500"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<p className="ml-3 text-base text-gray-700">{text}</p>
		</li>
	);
}
