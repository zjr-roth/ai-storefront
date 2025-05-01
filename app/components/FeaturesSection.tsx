import Image from "next/image";

export default function FeaturesSection() {
	return (
		<div
			className="py-16 bg-gray-100 overflow-hidden lg:py-24"
			id="how-it-works"
		>
			<div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
				<div className="relative">
					<h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
						Make Your Store Accessible to AI Agents
					</h2>
					<p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
						Help AI assistants find, understand, and recommend your
						products to customers
					</p>
				</div>

				<div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
					<div className="relative">
						<h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
							Simple Integration
						</h3>
						<p className="mt-3 text-lg text-gray-500">
							Add our lightweight JavaScript to your website to
							automatically make your store compatible with AI
							agents.
						</p>

						<dl className="mt-10 space-y-10">
							<div className="relative">
								<dt>
									<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
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
									</div>
									<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
										No code setup
									</p>
								</dt>
								<dd className="mt-2 ml-16 text-base text-gray-500">
									Simply add our code snippet to your website
									and we'll handle the rest. No coding skills
									required.
								</dd>
							</div>

							<div className="relative">
								<dt>
									<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
											/>
										</svg>
									</div>
									<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
										Works with any platform
									</p>
								</dt>
								<dd className="mt-2 ml-16 text-base text-gray-500">
									Compatible with Shopify, WooCommerce,
									Magento, and custom e-commerce solutions.
								</dd>
							</div>

							<div className="relative">
								<dt>
									<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
										Works instantly
									</p>
								</dt>
								<dd className="mt-2 ml-16 text-base text-gray-500">
									Products are ready for AI assistants
									immediately after implementation. No waiting
									required.
								</dd>
							</div>
						</dl>
					</div>

					<div
						className="mt-10 -mx-4 relative lg:mt-0"
						aria-hidden="true"
					>
						<div className="relative mx-auto rounded-lg shadow-lg overflow-hidden">
							<Image
								className="relative mx-auto"
								src="/dashboard-example.svg"
								alt="Dashboard example"
								width={500}
								height={350}
							/>
						</div>
					</div>
				</div>

				<div className="relative mt-24">
					<div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
						<div className="lg:col-start-2">
							<h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
								Analyze and optimize your AI discoverability
							</h3>
							<p className="mt-3 text-lg text-gray-500">
								Get detailed analytics on how AI agents interact
								with your products and how customers find your
								store through AI.
							</p>

							<dl className="mt-10 space-y-10">
								<div className="relative">
									<dt>
										<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
												/>
											</svg>
										</div>
										<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
											Detailed analytics
										</p>
									</dt>
									<dd className="mt-2 ml-16 text-base text-gray-500">
										See which AI assistants are recommending
										your products and how often they're
										being discovered.
									</dd>
								</div>

								<div className="relative">
									<dt>
										<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
												/>
											</svg>
										</div>
										<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
											AI conversation monitoring
										</p>
									</dt>
									<dd className="mt-2 ml-16 text-base text-gray-500">
										Understand how AI assistants describe
										your products to potential customers.
									</dd>
								</div>

								<div className="relative">
									<dt>
										<div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
											Conversion tracking
										</p>
									</dt>
									<dd className="mt-2 ml-16 text-base text-gray-500">
										Track purchases that come directly from
										AI assistant recommendations.
									</dd>
								</div>
							</dl>
						</div>

						<div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
							<div className="relative mx-auto rounded-lg shadow-lg overflow-hidden">
								<Image
									className="relative mx-auto"
									src="/analytics-example.svg"
									alt="Analytics example"
									width={500}
									height={350}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
