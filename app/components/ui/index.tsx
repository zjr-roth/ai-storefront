"use client";

import React from "react";

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	isLoading = false,
	className = "",
	disabled,
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

	const variantStyles = {
		primary:
			"bg-blue-600 text-white hover:bg-blue-700 border border-transparent",
		secondary:
			"bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
		outline:
			"bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600",
		ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent",
		link: "bg-transparent text-blue-600 hover:underline p-0 h-auto border-none shadow-none focus:ring-0",
	};

	const sizeStyles = {
		sm: "text-xs px-2.5 py-1.5",
		md: "text-sm px-4 py-2",
		lg: "text-base px-6 py-3",
	};

	const isDisabled = disabled || isLoading;

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${
				sizeStyles[size]
			} ${
				isDisabled ? "opacity-50 cursor-not-allowed" : ""
			} ${className}`}
			disabled={isDisabled}
			{...props}
		>
			{isLoading && (
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4"
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
			)}
			{children}
		</button>
	);
};

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "outline" | "filled";
}

export const Card: React.FC<CardProps> = ({
	children,
	variant = "default",
	className = "",
	...props
}) => {
	const variantStyles = {
		default: "bg-white border border-gray-200 shadow-sm",
		outline: "bg-white border border-gray-300",
		filled: "bg-gray-50 border border-gray-200",
	};

	return (
		<div
			className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={`px-6 py-4 border-b border-gray-200 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<h3
			className={`text-lg font-medium text-gray-900 ${className}`}
			{...props}
		>
			{children}
		</h3>
	);
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div className={`p-6 ${className}`} {...props}>
			{children}
		</div>
	);
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	helperText?: string;
	error?: string;
	icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
	label,
	helperText,
	error,
	icon,
	className = "",
	...props
}) => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</label>
			)}
			<div className="relative rounded-md shadow-sm">
				{icon && (
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						{icon}
					</div>
				)}
				<input
					className={`block w-full rounded-md ${
						error
							? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
							: "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
					} ${icon ? "pl-10" : ""} ${className}`}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${props.id}-error` : undefined}
					{...props}
				/>
			</div>
			{helperText && !error && (
				<p className="mt-1 text-xs text-gray-500">{helperText}</p>
			)}
			{error && (
				<p
					className="mt-1 text-xs text-red-600"
					id={`${props.id}-error`}
				>
					{error}
				</p>
			)}
		</div>
	);
};

// Alert Component
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "info" | "success" | "warning" | "error";
	title?: string;
	icon?: React.ReactNode;
	actions?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
	children,
	variant = "info",
	title,
	icon,
	actions,
	className = "",
	...props
}) => {
	const variantStyles = {
		info: "bg-blue-50 border-blue-400 text-blue-700",
		success: "bg-green-50 border-green-400 text-green-700",
		warning: "bg-amber-50 border-amber-400 text-amber-700",
		error: "bg-red-50 border-red-400 text-red-700",
	};

	const iconColors = {
		info: "text-blue-400",
		success: "text-green-400",
		warning: "text-amber-400",
		error: "text-red-400",
	};

	return (
		<div
			className={`border-l-4 p-4 rounded-md ${variantStyles[variant]} ${className}`}
			role="alert"
			{...props}
		>
			<div className="flex">
				{icon && (
					<div className={`flex-shrink-0 ${iconColors[variant]}`}>
						{icon}
					</div>
				)}
				<div className={`${icon ? "ml-3" : ""} flex-1`}>
					{title && <h3 className="text-sm font-medium">{title}</h3>}
					{children && <div className="text-sm mt-1">{children}</div>}
				</div>
				{actions && <div className="pl-3">{actions}</div>}
			</div>
		</div>
	);
};

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "primary" | "success" | "warning" | "error";
	size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
	children,
	variant = "default",
	size = "md",
	className = "",
	...props
}) => {
	const variantStyles = {
		default: "bg-gray-100 text-gray-800",
		primary: "bg-blue-100 text-blue-800",
		success: "bg-green-100 text-green-800",
		warning: "bg-amber-100 text-amber-800",
		error: "bg-red-100 text-red-800",
	};

	const sizeStyles = {
		sm: "text-xs px-2 py-0.5",
		md: "text-xs px-2.5 py-0.5",
		lg: "text-sm px-3 py-1",
	};

	return (
		<span
			className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		>
			{children}
		</span>
	);
};

// Tabs Component
interface TabItemProps {
	id: string;
	label: string;
}

interface TabsProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	items: TabItemProps[];
	activeId: string;
	onTabChange: (id: string) => void;
	variant?: "default" | "pills" | "underline";
}

export const Tabs: React.FC<TabsProps> = ({
	items,
	activeId,
	onTabChange,
	variant = "default",
	className = "",
	...props
}) => {
	const getTabStyles = (isActive: boolean) => {
		switch (variant) {
			case "pills":
				return isActive
					? "bg-blue-100 text-blue-700 font-medium"
					: "text-gray-500 hover:text-gray-700 hover:bg-gray-100";
			case "underline":
				return isActive
					? "border-b-2 border-blue-500 text-blue-600 font-medium"
					: "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
			default:
				return isActive
					? "bg-white text-gray-900 font-medium"
					: "text-gray-500 hover:text-gray-700";
		}
	};

	const wrapperStyles = {
		default: "border-b border-gray-200",
		pills: "",
		underline: "border-b border-gray-200",
	};

	return (
		<div className={wrapperStyles[variant]} {...props}>
			<nav className={`flex ${className}`} aria-label="Tabs">
				{items.map((item) => {
					const isActive = activeId === item.id;
					return (
						<button
							key={item.id}
							onClick={() => onTabChange(item.id)}
							className={`px-3 py-2 text-sm ${getTabStyles(
								isActive
							)} ${variant === "pills" ? "rounded-md mx-1" : ""}`}
							aria-current={isActive ? "page" : undefined}
						>
							{item.label}
						</button>
					);
				})}
			</nav>
		</div>
	);
};

// Toast Component
interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "success" | "warning" | "error";
	title: string;
	message?: string;
	onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
	variant = "default",
	title,
	message,
	onClose,
	className = "",
	...props
}) => {
	const variantStyles = {
		default: "bg-white",
		success: "bg-green-50 border-green-500",
		warning: "bg-amber-50 border-amber-500",
		error: "bg-red-50 border-red-500",
	};

	const iconStyles = {
		default: "text-gray-400",
		success: "text-green-500",
		warning: "text-amber-500",
		error: "text-red-500",
	};

	return (
		<div
			className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border-l-4 ${variantStyles[variant]} ${className}`}
			{...props}
		>
			<div className="p-4">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						{variant === "success" && (
							<svg
								className={`h-6 w-6 ${iconStyles[variant]}`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
						{variant === "warning" && (
							<svg
								className={`h-6 w-6 ${iconStyles[variant]}`}
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
						)}
						{variant === "error" && (
							<svg
								className={`h-6 w-6 ${iconStyles[variant]}`}
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
						)}
						{variant === "default" && (
							<svg
								className={`h-6 w-6 ${iconStyles[variant]}`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
					</div>
					<div className="ml-3 w-0 flex-1 pt-0.5">
						<p className="text-sm font-medium text-gray-900">
							{title}
						</p>
						{message && (
							<p className="mt-1 text-sm text-gray-500">
								{message}
							</p>
						)}
					</div>
					{onClose && (
						<div className="ml-4 flex-shrink-0 flex">
							<button
								className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								onClick={onClose}
							>
								<span className="sr-only">Close</span>
								<svg
									className="h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
