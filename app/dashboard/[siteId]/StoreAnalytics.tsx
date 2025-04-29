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
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884d8",
	"#82ca9d",
];

export default function StoreAnalytics({ siteId }: StoreAnalyticsProps) {
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">(
		"30days"
	);
	const [activeTab, setActiveTab] = useState<
		"overview" | "engagement" | "performance"
	>("overview");

	useEffect(() => {
		async function fetchAnalytics() {
			try {
				setLoading(true);

				// In a real implementation, this would call your API
				// const response = await fetch(`/api/analytics/${siteId}?timeRange=${timeRange}`);
				// const data = await response.json();

				// For now, we'll use mock data
				const mockData = generateMockData(timeRange);

				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				setAnalytics(mockData);
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
			<div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm mb-6 animate-pulse">
				<div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="h-40 bg-gray-100 rounded"></div>
					<div className="h-40 bg-gray-100 rounded"></div>
					<div className="h-40 bg-gray-100 rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 p-6 rounded-md border border-red-200 mb-6">
				<h3 className="text-red-700 font-medium mb-2">
					Analytics Error
				</h3>
				<p className="text-red-600">{error}</p>
			</div>
		);
	}

	if (!analytics) {
		return null;
	}

	return (
		<div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm mb-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl text-black font-bold">
					Store Analytics
				</h2>
				<div className="flex space-x-2">
					<select
						className="border rounded text-black p-1 text-sm"
						value={timeRange}
						onChange={(e) =>
							setTimeRange(
								e.target.value as "7days" | "30days" | "90days"
							)
						}
					>
						<option className="text-black" value="7days">
							Last 7 days
						</option>
						<option className="text-black" value="30days">
							Last 30 days
						</option>
						<option className="text-black" value="90days">
							Last 90 days
						</option>
					</select>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="flex border-b mb-6">
				<button
					onClick={() => setActiveTab("overview")}
					className={`py-2 px-4 ${
						activeTab === "overview"
							? "border-b-2 text-gray-400 border-black font-medium"
							: "text-black"
					}`}
				>
					Overview
				</button>
				<button
					onClick={() => setActiveTab("engagement")}
					className={`py-2 px-4 ${
						activeTab === "engagement"
							? "border-b-2 text-gray-400 border-black font-medium"
							: "text-black"
					}`}
				>
					Agent Engagement
				</button>
				<button
					onClick={() => setActiveTab("performance")}
					className={`py-2 px-4 ${
						activeTab === "performance"
							? "border-b-2 text-gray-400 border-black font-medium"
							: "text-black"
					}`}
				>
					Performance
				</button>
			</div>

			{/* Tab Content */}
			{activeTab === "overview" && (
				<div>
					{/* Key Metrics */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<MetricCard
							title="AI Agent Interactions"
							value={analytics.agent_interaction_count.toString()}
							description={analytics.agent_interaction_frequency}
						/>
						<MetricCard
							title="Schema Health"
							value={`${analytics.schema_health.health_score}%`}
							description={`${analytics.schema_health.pages_with_schema} of ${analytics.schema_health.total_pages_checked} pages validated`}
						/>
						<MetricCard
							title="Product Discovery"
							value={`${analytics.product_discovery.discovery_rate}%`}
							description={`${analytics.product_discovery.products_surfaced} of ${analytics.product_discovery.total_products} products discovered`}
						/>
					</div>

					{/* Daily Interactions Chart */}
					<div className="mb-8">
						<h3 className="text-lg font-medium text-black mb-4">
							Daily AI Agent Interactions
						</h3>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={analytics.daily_interactions}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="date"
										tickFormatter={(date) =>
											format(parseISO(date), "MMM d")
										}
									/>
									<YAxis />
									<Tooltip
										labelFormatter={(date) =>
											format(
												parseISO(date),
												"MMMM d, yyyy"
											)
										}
									/>
									<Legend />
									<Line
										type="monotone"
										dataKey="count"
										name="Agent Interactions"
										stroke="#0070f3"
										activeDot={{ r: 8 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Most Surfaced Products */}
					<div>
						<h3 className="text-lg text-black font-medium mb-4">
							Most Surfaced Products
						</h3>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={analytics.most_surfaced_products}
									layout="vertical"
									margin={{
										top: 5,
										right: 30,
										left: 120,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis type="number" />
									<YAxis
										type="category"
										dataKey="title"
										width={100}
										tickFormatter={(title) =>
											title.length > 20
												? `${title.substring(0, 20)}...`
												: title
										}
									/>
									<Tooltip />
									<Legend />
									<Bar
										dataKey="impression_count"
										name="Impressions"
										fill="#0070f3"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}

			{activeTab === "engagement" && (
				<div>
					{/* Top Referring Agents */}
					<div className="mb-8">
						<h3 className="text-lg font-medium mb-4">
							Top Referring AI Agents
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="h-72">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={
												analytics.top_referring_agents
											}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={80}
											dataKey="visit_count"
											nameKey="agent_name"
											label={({ agent_name, percent }) =>
												`${agent_name}: ${(
													percent * 100
												).toFixed(0)}%`
											}
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
													/>
												)
											)}
										</Pie>
										<Tooltip
											formatter={(value) => [
												`${value} visits`,
												"Count",
											]}
										/>
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div>
								<div className="bg-gray-50 p-4 rounded-md">
									<h4 className="font-medium mb-2">
										Agent Engagement Overview
									</h4>
									<p className="text-sm text-gray-600 mb-4">
										AI Agents have generated{" "}
										{analytics.ai_conversions.visit_count}{" "}
										visits to your store, resulting in{" "}
										{
											analytics.ai_conversions
												.conversion_count
										}{" "}
										conversions (
										{
											analytics.ai_conversions
												.conversion_rate
										}
										% conversion rate).
									</p>
									<h4 className="font-medium mb-2">
										Estimated Revenue Impact
									</h4>
									<p className="text-2xl font-bold">
										$
										{analytics.ai_conversions.revenue.toFixed(
											2
										)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Monthly Engagement Growth */}
					<div className="mb-8">
						<h3 className="text-lg font-medium mb-4">
							Monthly Engagement Growth
						</h3>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={analytics.monthly_engagement}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip
										formatter={(value, name) => [
											name === "growth_rate"
												? `${value}%`
												: value,
											name === "growth_rate"
												? "Growth Rate"
												: "Interactions",
										]}
									/>
									<Legend />
									<Bar
										dataKey="interaction_count"
										name="Interactions"
										fill="#0070f3"
									/>
									<Bar
										dataKey="growth_rate"
										name="Growth Rate (%)"
										fill="#00C49F"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}

			{activeTab === "performance" && (
				<div>
					{/* Performance Metrics */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<MetricCard
							title="Avg Response Time"
							value={`${analytics.manifest_performance.avg_response_time_ms} ms`}
							description={`P95: ${analytics.manifest_performance.p95_response_time_ms} ms`}
						/>
						<MetricCard
							title="Data Freshness"
							value={`${analytics.data_freshness.avg_product_age_days} days`}
							description={`${analytics.data_freshness.products_updated_last_7d} products updated in last 7 days`}
						/>
						<MetricCard
							title="Schema Health"
							value={`${analytics.schema_health.health_score}%`}
							description={`${analytics.schema_health.pages_with_schema} of ${analytics.schema_health.total_pages_checked} pages with valid schema`}
						/>
					</div>

					{/* Product Data Freshness */}
					<div className="mb-8">
						<h3 className="text-lg font-medium mb-4">
							Product Data Age Distribution
						</h3>
						<div className="p-4 bg-gray-50 rounded-md mb-4">
							<p className="text-sm text-gray-600">
								Your products are updated on average every{" "}
								{analytics.data_freshness.avg_product_age_days}{" "}
								days. The oldest product data was last updated
								on{" "}
								{format(
									parseISO(
										analytics.data_freshness
											.oldest_product_updated_at
									),
									"MMMM d, yyyy"
								)}
								.
							</p>
						</div>

						{/* Product Data Freshness Chart would go here */}
						<div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
							Product Age Distribution Chart
							<br />
							(Implementation would use actual product update
							timestamps)
						</div>
					</div>

					{/* Schema Validation Results */}
					<div>
						<h3 className="text-lg font-medium mb-4">
							Schema Validation History
						</h3>
						<div className="p-4 bg-gray-50 rounded-md mb-4">
							<p className="text-sm text-gray-600">
								Schema health score:{" "}
								<span className="font-medium">
									{analytics.schema_health.health_score}%
								</span>
								<br />
								{
									analytics.schema_health.pages_with_schema
								} of{" "}
								{analytics.schema_health.total_pages_checked}{" "}
								pages have valid schema.
							</p>
						</div>

						{/* Schema Validation Chart would go here */}
						<div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
							Schema Validation History Chart
							<br />
							(Implementation would track schema_missing events
							over time)
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Helper component for metric cards
function MetricCard({
	title,
	value,
	description,
}: {
	title: string;
	value: string;
	description: string;
}) {
	return (
		<div className="bg-gray-50 p-4 rounded-md">
			<h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
			<p className="text-2xl font-bold mb-1">{value}</p>
			<p className="text-xs text-gray-600">{description}</p>
		</div>
	);
}

// Mock data generator function
function generateMockData(timeRange: string): AnalyticsData {
	const today = new Date();

	// Generate daily interactions for the selected time range
	const daysCount =
		timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
	const dailyInteractions = Array.from({ length: daysCount }, (_, i) => {
		const date = subDays(today, daysCount - i - 1);
		return {
			date: date.toISOString().split("T")[0],
			count: Math.floor(Math.random() * 20) + 10, // Random between 10-30
		};
	});

	// Calculate total interactions from the daily data
	const totalInteractions = dailyInteractions.reduce(
		(sum, day) => sum + day.count,
		0
	);

	// Generate mock monthly engagement data
	const monthlyEngagement = [
		{ month: "Jan", interaction_count: 240, growth_rate: 0 },
		{ month: "Feb", interaction_count: 280, growth_rate: 16.7 },
		{ month: "Mar", interaction_count: 300, growth_rate: 7.1 },
		{ month: "Apr", interaction_count: 340, growth_rate: 13.3 },
	];

	return {
		// Agent Interaction Metrics
		agent_interaction_count: totalInteractions,
		agent_interaction_frequency: `${(totalInteractions / daysCount).toFixed(
			1
		)} per day`,
		most_surfaced_products: [
			{
				product_id: "p1",
				title: "Premium Leather Wallet",
				impression_count: 78,
			},
			{
				product_id: "p2",
				title: "Wireless Bluetooth Earbuds",
				impression_count: 65,
			},
			{
				product_id: "p3",
				title: "Stainless Steel Water Bottle",
				impression_count: 52,
			},
			{
				product_id: "p4",
				title: "Ceramic Coffee Mug Set",
				impression_count: 47,
			},
			{
				product_id: "p5",
				title: "Bamboo Cutting Board",
				impression_count: 34,
			},
		],
		top_referring_agents: [
			{ agent_name: "Claude", visit_count: 145 },
			{ agent_name: "Google Assistant", visit_count: 98 },
			{ agent_name: "ChatGPT", visit_count: 76 },
			{ agent_name: "Bing Chat", visit_count: 42 },
			{ agent_name: "Other Agents", visit_count: 28 },
		],

		// Performance Metrics
		schema_health: {
			total_pages_checked: 18,
			pages_with_schema: 16,
			health_score: 89,
		},
		manifest_performance: {
			avg_response_time_ms: 124,
			p95_response_time_ms: 287,
		},
		data_freshness: {
			avg_product_age_days: 12,
			oldest_product_updated_at: subDays(today, 32).toISOString(),
			products_updated_last_7d: 8,
		},

		// Business Impact Metrics
		ai_conversions: {
			visit_count: totalInteractions,
			conversion_count: Math.floor(totalInteractions * 0.06), // 6% conversion rate
			conversion_rate: 6.0,
			revenue: totalInteractions * 0.06 * 45.75, // Avg order value $45.75
		},
		product_discovery: {
			total_products: 14,
			products_surfaced: 12,
			discovery_rate: 86,
		},

		// Time Series Data
		monthly_engagement: monthlyEngagement,
		daily_interactions: dailyInteractions,
	};
}
