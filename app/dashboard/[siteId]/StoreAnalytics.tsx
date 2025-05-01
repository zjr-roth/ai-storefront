"use client";

import { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";

interface StoreAnalyticsProps {
	siteId: string;
	timeRange?: "7days" | "30days" | "90days";
}

interface AnalyticsData {
	// Agent Interaction Metrics
	agent_interaction_count: number;
	agent_interaction_frequency: string;
	most_surfaced_products: {
		product_id: string;
		title: string;
		impression_count: number;
	}[];
	top_referring_agents: {
		agent_name: string;
		visit_count: number;
	}[];

	// Performance Metrics
	schema_health: {
		total_pages_checked: number;
		pages_with_schema: number;
		health_score: number;
	};
	manifest_performance: {
		avg_response_time_ms: number;
		p95_response_time_ms: number;
	};
	data_freshness: {
		avg_product_age_days: number;
		oldest_product_updated_at: string;
		products_updated_last_7d: number;
	};

	// Business Impact Metrics
	ai_conversions: {
		visit_count: number;
		conversion_count: number;
		conversion_rate: number;
		revenue: number;
	};
	product_discovery: {
		total_products: number;
		products_surfaced: number;
		discovery_rate: number;
	};

	// Time Series Data
	monthly_engagement: {
		month: string;
		interaction_count: number;
		growth_rate: number;
	}[];

	daily_interactions: {
		date: string;
		count: number;
	}[];
}

const COLORS = [
	"#3b82f6", // blue-500
	"#10b981", // emerald-500
	"#f59e0b", // amber-500
	"#ef4444", // red-500
	"#8b5cf6", // violet-500
	"#ec4899", // pink-500
];

export default function StoreAnalytics({
	siteId,
	timeRange: initialTimeRange = "30days",
}: StoreAnalyticsProps) {
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">(
		initialTimeRange
	);

	useEffect(() => {
		async function fetchAnalytics() {
			try {
				setLoading(true);

				// In a real implementation, this would call your API
				const response = await fetch(
					`/api/analytics/${siteId}?timeRange=${timeRange}`
				);

				if (!response.ok) {
					throw new Error(`API error: ${response.status}`);
				}

				const data = await response.json();
				setAnalytics(data);
			} catch (err: any) {
				setError(err.message || "Failed to load analytics");
				console.error("Analytics error:", err);
			} finally {
				setLoading(false);
			}
		}

		if (siteId) {
			fetchAnalytics();
		}
	}, [siteId, timeRange]);

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
				<div className="p-6 border-b border-gray-200">
					<div className="h-6 bg-gray-200 rounded-full w-1/3 mb-4"></div>
					<div className="flex space-x-2">
						<div className="h-8 bg-gray-200 rounded w-16"></div>
						<div className="h-8 bg-gray-200 rounded w-16"></div>
						<div className="h-8 bg-gray-200 rounded w-16"></div>
					</div>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="h-24 bg-gray-100 rounded"></div>
						<div className="h-24 bg-gray-100 rounded"></div>
						<div className="h-24 bg-gray-100 rounded"></div>
					</div>
					<div className="h-64 bg-gray-100 rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 rounded-lg border border-red-200 p-6">
				<div className="flex items-center">
					<svg
						className="h-6 w-6 text-red-600 mr-3"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-red-800">
						Analytics Error
					</h3>
				</div>
				<div className="mt-2">
					<p className="text-sm text-red-700">{error}</p>
				</div>
				<div className="mt-4">
					<button
						onClick={() => window.location.reload()}
						className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!analytics) {
		return null;
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div className="p-6 border-b border-gray-200 flex items-center justify-between">
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
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
					Analytics Overview
				</h2>
				<div className="flex space-x-1">
					<button
						onClick={() => setTimeRange("7days")}
						className={`px-3 py-1 text-xs font-medium rounded-md ${
							timeRange === "7days"
								? "bg-blue-100 text-blue-800"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
					>
						7 Days
					</button>
					<button
						onClick={() => setTimeRange("30days")}
						className={`px-3 py-1 text-xs font-medium rounded-md ${
							timeRange === "30days"
								? "bg-blue-100 text-blue-800"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
					>
						30 Days
					</button>
					<button
						onClick={() => setTimeRange("90days")}
						className={`px-3 py-1 text-xs font-medium rounded-md ${
							timeRange === "90days"
								? "bg-blue-100 text-blue-800"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
					>
						90 Days
					</button>
				</div>
			</div>

			<div className="p-6">
				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
					<MetricCard
						title="AI Agent Interactions"
						value={analytics.agent_interaction_count.toString()}
						description={analytics.agent_interaction_frequency}
						icon={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
								/>
							</svg>
						}
						trend={7}
						color="blue"
					/>
					<MetricCard
						title="Discovery Rate"
						value={`${analytics.product_discovery.discovery_rate}%`}
						description={`${analytics.product_discovery.products_surfaced} of ${analytics.product_discovery.total_products} products`}
						icon={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						}
						trend={3}
						color="green"
					/>
					<MetricCard
						title="Conversion Rate"
						value={`${analytics.ai_conversions.conversion_rate}%`}
						description={`$${analytics.ai_conversions.revenue.toFixed(
							2
						)} estimated revenue`}
						icon={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-7 w-7"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						}
						trend={2}
						color="amber"
					/>
				</div>

				{/* Daily Interactions Chart */}
				<div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-base font-medium text-gray-900">
							Daily AI Agent Interactions
						</h3>
						<span className="text-xs font-medium text-gray-500">
							{timeRange === "7days"
								? "Last 7 days"
								: timeRange === "30days"
								? "Last 30 days"
								: "Last 90 days"}
						</span>
					</div>
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={analytics.daily_interactions}
								margin={{
									top: 5,
									right: 10,
									left: 10,
									bottom: 5,
								}}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#f0f0f0"
								/>
								<XAxis
									dataKey="date"
									tickFormatter={(date) =>
										format(parseISO(date), "MMM d")
									}
									stroke="#9ca3af"
									fontSize={12}
								/>
								<YAxis stroke="#9ca3af" fontSize={12} />
								<Tooltip
									contentStyle={{
										borderRadius: "0.375rem",
										border: "1px solid #e5e7eb",
										boxShadow:
											"0 1px 3px 0 rgba(0, 0, 0, 0.1)",
									}}
									labelFormatter={(date) =>
										format(parseISO(date), "MMMM d, yyyy")
									}
								/>
								<Line
									type="monotone"
									dataKey="count"
									name="Agent Interactions"
									stroke="#3b82f6"
									activeDot={{ r: 6, strokeWidth: 0 }}
									dot={{
										r: 3,
										strokeWidth: 0,
										fill: "#3b82f6",
									}}
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Top Agents */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white p-6 rounded-lg border border-gray-200">
						<h3 className="text-base font-medium text-gray-900 mb-4">
							Top AI Agents
						</h3>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={analytics.top_referring_agents}
										cx="50%"
										cy="50%"
										innerRadius={70}
										outerRadius={90}
										fill="#8884d8"
										paddingAngle={3}
										dataKey="visit_count"
										nameKey="agent_name"
										label={({ name, percent }) =>
											`${name}: ${(percent * 100).toFixed(
												0
											)}%`
										}
										labelLine={false}
									>
										{analytics.top_referring_agents.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														COLORS[
															index %
																COLORS.length
														]
													}
													strokeWidth={1}
												/>
											)
										)}
									</Pie>
									<Tooltip
										formatter={(value) => [
											`${value} visits`,
											"Count",
										]}
										contentStyle={{
											borderRadius: "0.375rem",
											border: "1px solid #e5e7eb",
											boxShadow:
												"0 1px 3px 0 rgba(0, 0, 0, 0.1)",
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Most Surfaced Products */}
					<div className="bg-white p-6 rounded-lg border border-gray-200">
						<h3 className="text-base font-medium text-gray-900 mb-4">
							Most Surfaced Products
						</h3>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={analytics.most_surfaced_products.slice(
										0,
										5
									)}
									layout="vertical"
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#f0f0f0"
										horizontal={true}
										vertical={false}
									/>
									<XAxis
										type="number"
										stroke="#9ca3af"
										fontSize={12}
									/>
									<YAxis
										type="category"
										dataKey="title"
										width={120}
										stroke="#9ca3af"
										fontSize={12}
										tickFormatter={(title) =>
											title.length > 15
												? `${title.substring(0, 15)}...`
												: title
										}
									/>
									<Tooltip
										formatter={(value) => [
											`${value} impressions`,
											"Count",
										]}
										contentStyle={{
											borderRadius: "0.375rem",
											border: "1px solid #e5e7eb",
											boxShadow:
												"0 1px 3px 0 rgba(0, 0, 0, 0.1)",
										}}
									/>
									<Bar
										dataKey="impression_count"
										name="Impressions"
										fill="#10b981"
										radius={[0, 4, 4, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
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
						<div className="ml-3">
							<h3 className="text-sm font-medium text-blue-800">
								Analytics Tip
							</h3>
							<div className="mt-2 text-sm text-blue-700">
								<p>
									Based on your data, AI agents are
									successfully discovering{" "}
									{analytics.product_discovery.discovery_rate}
									% of your products. Consider enhancing your
									product descriptions to improve discovery
									even further.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function MetricCard({
	title,
	value,
	description,
	icon,
	trend,
	color = "blue",
}: {
	title: string;
	value: string;
	description: string;
	icon: React.ReactNode;
	trend: number;
	color: "blue" | "green" | "amber" | "red";
}) {
	const colorMap = {
		blue: {
			bg: "bg-blue-50",
			iconBg: "bg-blue-100",
			iconText: "text-blue-600",
			title: "text-blue-800",
			value: "text-blue-900",
			desc: "text-blue-600",
			trendUp: "text-blue-700",
			trendDown: "text-red-600",
		},
		green: {
			bg: "bg-green-50",
			iconBg: "bg-green-100",
			iconText: "text-green-600",
			title: "text-green-800",
			value: "text-green-900",
			desc: "text-green-600",
			trendUp: "text-green-700",
			trendDown: "text-red-600",
		},
		amber: {
			bg: "bg-amber-50",
			iconBg: "bg-amber-100",
			iconText: "text-amber-600",
			title: "text-amber-800",
			value: "text-amber-900",
			desc: "text-amber-600",
			trendUp: "text-green-700",
			trendDown: "text-red-600",
		},
		red: {
			bg: "bg-red-50",
			iconBg: "bg-red-100",
			iconText: "text-red-600",
			title: "text-red-800",
			value: "text-red-900",
			desc: "text-red-600",
			trendUp: "text-green-700",
			trendDown: "text-red-700",
		},
	};

	const colors = colorMap[color];

	return (
		<div className={`${colors.bg} rounded-lg p-5 border border-gray-200`}>
			<div className="flex items-center justify-between">
				<div
					className={`h-12 w-12 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconText}`}
				>
					{icon}
				</div>
				{trend !== 0 && (
					<div className="flex items-center">
						<span
							className={`text-xs font-medium ${
								trend > 0 ? colors.trendUp : colors.trendDown
							}`}
						>
							{trend > 0 ? "+" : ""}
							{trend}%
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-4 w-4 ml-1 ${
								trend > 0 ? colors.trendUp : colors.trendDown
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							{trend > 0 ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 10l7-7m0 0l7 7m-7-7v18"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							)}
						</svg>
					</div>
				)}
			</div>
			<div className="mt-4">
				<h3 className={`text-sm font-medium ${colors.title}`}>
					{title}
				</h3>
				<p className={`text-2xl font-bold mt-1 ${colors.value}`}>
					{value}
				</p>
				<p className={`text-xs mt-1 ${colors.desc}`}>{description}</p>
			</div>
		</div>
	);
}
