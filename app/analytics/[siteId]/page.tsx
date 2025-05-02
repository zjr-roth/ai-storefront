"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StoreAnalytics from "@/app/dashboard/[siteId]/StoreAnalytics";

export default function AnalyticsPage() {
	const params = useParams();
	const siteId = params.siteId as string;
	const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">(
		"30days"
	);

	if (!siteId) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full p-6">
					<div className="text-center">
						<svg
							className="mx-auto h-12 w-12 text-gray-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<h2 className="mt-2 text-lg font-medium text-gray-900">
							No Site ID Found
						</h2>
						<p className="mt-1 text-sm text-gray-500">
							Please select a site from the dashboard.
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
							Analytics Dashboard
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Monitor AI agent interactions and conversions
						</p>
					</div>
					<div className="mt-4 md:mt-0 flex space-x-2">
						<button
							onClick={() => setTimeRange("7days")}
							className={`px-3 py-1 text-sm font-medium rounded-md ${
								timeRange === "7days"
									? "bg-blue-100 text-blue-800"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							7 Days
						</button>
						<button
							onClick={() => setTimeRange("30days")}
							className={`px-3 py-1 text-sm font-medium rounded-md ${
								timeRange === "30days"
									? "bg-blue-100 text-blue-800"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							30 Days
						</button>
						<button
							onClick={() => setTimeRange("90days")}
							className={`px-3 py-1 text-sm font-medium rounded-md ${
								timeRange === "90days"
									? "bg-blue-100 text-blue-800"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							90 Days
						</button>
					</div>
				</div>

				{/* Full-page analytics */}
				<StoreAnalytics siteId={siteId} timeRange={timeRange} />

				{/* Additional analytics insights */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
										d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								AI Agent Performance
							</h2>
							<div className="mt-4 space-y-6">
								<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
									<h3 className="text-sm font-medium text-gray-700">
										Interaction Frequency
									</h3>
									<div className="mt-2 grid grid-cols-7 gap-2">
										{[...Array(7)].map((_, i) => (
											<div
												key={i}
												className="flex flex-col items-center"
											>
												<div
													className="w-full bg-blue-100 rounded-sm"
													style={{
														height: `${
															Math.floor(
																Math.random() *
																	60
															) + 20
														}px`,
													}}
												></div>
												<span className="text-xs text-gray-500 mt-1">
													{String.fromCharCode(
														83 - i
													)}
												</span>
											</div>
										))}
									</div>
									<p className="mt-2 text-xs text-gray-500">
										Daily interaction pattern (S = Sunday)
									</p>
								</div>

								<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
									<h3 className="text-sm font-medium text-gray-700">
										AI Conversion Insights
									</h3>
									<div className="mt-2 space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-600">
												Product discovery rate
											</span>
											<div className="w-2/3 bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-blue-600 h-2.5 rounded-full"
													style={{ width: "85%" }}
												></div>
											</div>
											<span className="text-xs font-medium text-gray-600">
												85%
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-600">
												Click-through rate
											</span>
											<div className="w-2/3 bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-green-500 h-2.5 rounded-full"
													style={{ width: "42%" }}
												></div>
											</div>
											<span className="text-xs font-medium text-gray-600">
												42%
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-600">
												Purchase conversion
											</span>
											<div className="w-2/3 bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-amber-500 h-2.5 rounded-full"
													style={{ width: "6%" }}
												></div>
											</div>
											<span className="text-xs font-medium text-gray-600">
												6%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

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
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									/>
								</svg>
								Optimization Recommendations
							</h2>
							<div className="mt-4 space-y-4">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-blue-600"
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
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">
											Product Description Quality
										</p>
										<p className="mt-1 text-sm text-gray-500">
											Enhance product descriptions with
											more specific details about
											materials, dimensions, and use cases
											to improve AI agent recommendations.
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-green-600"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">
											Schema Implementation
										</p>
										<p className="mt-1 text-sm text-gray-500">
											Your schema markup is working well.
											AI agents are successfully finding
											and understanding your products.
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-amber-600"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">
											Image Quality
										</p>
										<p className="mt-1 text-sm text-gray-500">
											Consider adding higher resolution
											images with better lighting to
											improve product presentation to AI
											agents.
										</p>
									</div>
								</div>
							</div>

							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
								<h3 className="text-sm font-medium text-blue-800">
									Insight Highlight
								</h3>
								<p className="mt-2 text-sm text-blue-700">
									Claude is your most active AI agent,
									accounting for 45% of all product
									interactions. Focus optimization efforts on
									ensuring your product details are formatted
									to work well with Claude's understanding.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
