"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SettingsPage() {
	const params = useParams();
	const siteId = params.siteId as string;
	const supabase = createClientComponentClient();

	const [domain, setDomain] = useState("");
	const [apiKey, setApiKey] = useState(
		"sk_live_" + Math.random().toString(36).substring(2, 15)
	);
	const [isSaving, setIsSaving] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [isCodeCopied, setIsCodeCopied] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [tabs, setTabs] = useState<
		"general" | "integration" | "notifications"
	>("general");

	// Fetch site settings
	useEffect(() => {
		const fetchSiteSettings = async () => {
			if (!siteId) return;

			try {
				const { data, error } = await supabase
					.from("sites")
					.select("domain")
					.eq("id", siteId)
					.single();

				if (error) throw error;
				if (data) {
					setDomain(data.domain);
				}
			} catch (err) {
				console.error("Error fetching site settings:", err);
			}
		};

		fetchSiteSettings();
	}, [siteId, supabase]);

	const handleSave = async () => {
		if (!siteId) return;

		setIsSaving(true);
		try {
			const { error } = await supabase
				.from("sites")
				.update({ domain })
				.eq("id", siteId);

			if (error) throw error;
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} catch (err) {
			console.error("Error saving settings:", err);
		} finally {
			setIsSaving(false);
		}
	};

	const copyToClipboard = (text: string, field: "api" | "code") => {
		navigator.clipboard.writeText(text);
		if (field === "api") {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} else {
			setIsCodeCopied(true);
			setTimeout(() => setIsCodeCopied(false), 2000);
		}
	};

	const injectCode = `<!-- AI Storefront Integration -->
<script src="https://cdn.aistorefront.io/injector.v1.js"
  data-site-id="${siteId}"
  async>
</script>`;

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
							Settings
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Configure your AI Storefront integration
						</p>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<div className="border-b border-gray-200">
						<nav className="flex -mb-px">
							<button
								onClick={() => setTabs("general")}
								className={`px-6 py-3 text-sm font-medium ${
									tabs === "general"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
								}`}
							>
								General
							</button>
							<button
								onClick={() => setTabs("integration")}
								className={`px-6 py-3 text-sm font-medium ${
									tabs === "integration"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
								}`}
							>
								Integration
							</button>
							<button
								onClick={() => setTabs("notifications")}
								className={`px-6 py-3 text-sm font-medium ${
									tabs === "notifications"
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
								}`}
							>
								Notifications
							</button>
						</nav>
					</div>

					<div className="p-6">
						{tabs === "general" && (
							<div className="space-y-6">
								<div>
									<h2 className="text-lg font-medium text-gray-900">
										Site Information
									</h2>
									<p className="mt-1 text-sm text-gray-500">
										Basic information about your store
									</p>
								</div>

								<div className="grid grid-cols-1 gap-6">
									<div>
										<label
											htmlFor="domain"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Domain
										</label>
										<div className="flex">
											<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
												https://
											</span>
											<input
												type="text"
												id="domain"
												value={domain}
												onChange={(e) =>
													setDomain(e.target.value)
												}
												className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
												placeholder="yourdomain.com"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="siteId"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Site ID
										</label>
										<input
											type="text"
											id="siteId"
											value={siteId}
											disabled
											className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 sm:text-sm"
										/>
										<p className="mt-1 text-xs text-gray-500">
											Your unique site identifier (cannot
											be changed)
										</p>
									</div>
								</div>

								<div className="pt-5">
									<div className="flex justify-end">
										<button
											type="button"
											onClick={handleSave}
											disabled={isSaving}
											className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
												isSaving
													? "opacity-75 cursor-not-allowed"
													: ""
											}`}
										>
											{isSaving ? (
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
												"Save Changes"
											)}
										</button>
									</div>
									{saveSuccess && (
										<div className="mt-3 text-sm text-green-600">
											Settings saved successfully!
										</div>
									)}
								</div>
							</div>
						)}

						{tabs === "integration" && (
							<div className="space-y-6">
								<div>
									<h2 className="text-lg font-medium text-gray-900">
										Integration Settings
									</h2>
									<p className="mt-1 text-sm text-gray-500">
										Connect your store to AI agents
									</p>
								</div>

								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											API Key
										</label>
										<div className="flex">
											<input
												type="text"
												value={apiKey}
												disabled
												className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 bg-gray-100 text-gray-500 sm:text-sm"
											/>
											<button
												type="button"
												onClick={() =>
													copyToClipboard(
														apiKey,
														"api"
													)
												}
												className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											>
												{isCopied ? "Copied!" : "Copy"}
											</button>
										</div>
										<p className="mt-1 text-xs text-gray-500">
											Use this key to authenticate API
											requests
										</p>
									</div>

									<div className="border-t border-gray-200 pt-4 mt-4">
										<h3 className="text-base font-medium text-gray-900">
											Script Installation
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Add this script to your website to
											enable AI agent integration
										</p>

										<div className="mt-2 bg-gray-800 rounded-md p-3 font-mono text-sm text-white">
											<div className="flex justify-between items-start">
												<pre className="whitespace-pre-wrap overflow-x-auto">
													{injectCode}
												</pre>
												<button
													type="button"
													onClick={() =>
														copyToClipboard(
															injectCode,
															"code"
														)
													}
													className="ml-2 flex-shrink-0 p-1 rounded-md bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
												>
													{isCodeCopied ? (
														<svg
															className="h-5 w-5"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																fillRule="evenodd"
																d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																clipRule="evenodd"
															/>
														</svg>
													) : (
														<svg
															className="h-5 w-5"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
															<path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
														</svg>
													)}
												</button>
											</div>
										</div>

										<p className="mt-2 text-sm text-gray-500">
											Add this code to the{" "}
											<code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
												{"<head>"}
											</code>{" "}
											section of your website to enable AI
											agent compatibility.
										</p>
									</div>
								</div>

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
												Integration Tip
											</h3>
											<div className="mt-2 text-sm text-blue-700">
												<p>
													Place the script tag just
													before the closing{" "}
													<code className="px-1 py-0.5 bg-blue-200 rounded text-xs">
														{"</head>"}
													</code>{" "}
													tag for optimal performance.
													This ensures AI agents can
													discover and recommend your
													products.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{tabs === "notifications" && (
							<div className="space-y-6">
								<div>
									<h2 className="text-lg font-medium text-gray-900">
										Notification Settings
									</h2>
									<p className="mt-1 text-sm text-gray-500">
										Configure when and how you receive
										alerts
									</p>
								</div>

								<div className="space-y-4">
									<div className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="email-notifications"
												name="email-notifications"
												type="checkbox"
												className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
												defaultChecked
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="email-notifications"
												className="font-medium text-gray-700"
											>
												Email Notifications
											</label>
											<p className="text-gray-500">
												Receive weekly reports and
												important alerts via email
											</p>
										</div>
									</div>

									<div className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="agent-interactions"
												name="agent-interactions"
												type="checkbox"
												className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
												defaultChecked
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="agent-interactions"
												className="font-medium text-gray-700"
											>
												AI Agent Interactions
											</label>
											<p className="text-gray-500">
												Get notified when AI agents
												interact with your products
											</p>
										</div>
									</div>

									<div className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="conversion-alerts"
												name="conversion-alerts"
												type="checkbox"
												className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
												defaultChecked
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="conversion-alerts"
												className="font-medium text-gray-700"
											>
												Conversion Alerts
											</label>
											<p className="text-gray-500">
												Receive alerts when AI
												interactions result in
												conversions
											</p>
										</div>
									</div>

									<div className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="health-alerts"
												name="health-alerts"
												type="checkbox"
												className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
												defaultChecked
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="health-alerts"
												className="font-medium text-gray-700"
											>
												Schema Health Alerts
											</label>
											<p className="text-gray-500">
												Get notified of issues with your
												product schema that might affect
												AI discoverability
											</p>
										</div>
									</div>
								</div>

								<div className="pt-5">
									<div className="flex justify-end">
										<button
											type="button"
											className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											Save Preferences
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
