// IPC Error Handler
// Provides structured error handling for IPC communication

import type { ErrorResponse } from "@shared/types/ipc-contracts";
import { IPCErrorCode } from "@shared/types/ipc-contracts";
import { ZodError } from "zod";

/**
 * Creates a structured error response for IPC communication
 */
export function createIPCError(
	code: IPCErrorCode,
	message: string,
	details?: unknown,
): ErrorResponse {
	return {
		success: false,
		error: {
			code,
			message,
			details,
		},
	};
}

/**
 * Wraps an IPC handler function with standardized error handling
 * Compatible with Electron's ipcMain.handle which passes (event, ...args)
 */
export function wrapIPCHandler<TArgs, TResult>(
	handler: (args: TArgs) => Promise<TResult>,
): (
	_event: unknown,
	args: TArgs,
) => Promise<{ success: true; data: TResult } | ErrorResponse> {
	return async (_event: unknown, args: TArgs) => {
		try {
			console.log("🔧 IPC Handler called with args:", args);
			const data = await handler(args);
			console.log("✅ IPC Handler success");
			return {
				success: true,
				data,
			};
		} catch (error) {
			console.error("❌ IPC Handler error:", error);
			return handleIPCError(error);
		}
	};
}

/**
 * Converts various error types to structured IPC error responses
 */
export function handleIPCError(error: unknown): ErrorResponse {
	// Zod validation errors
	if (error instanceof ZodError) {
		const issues = error.issues;
		const firstError = issues[0];
		return createIPCError(
			IPCErrorCode.INVALID_INPUT,
			`Validation error: ${firstError.path.join(".")} - ${firstError.message}`,
			{ zodErrors: issues },
		);
	}

	// Node.js file system errors
	if (isNodeError(error)) {
		switch (error.code) {
			case "ENOENT":
				return createIPCError(
					IPCErrorCode.FILE_NOT_FOUND,
					`File not found: ${error.path || "unknown"}`,
					{ originalError: error.message },
				);
			case "EEXIST":
				return createIPCError(
					IPCErrorCode.FILE_ALREADY_EXISTS,
					`File already exists: ${error.path || "unknown"}`,
					{ originalError: error.message },
				);
			case "EACCES":
			case "EPERM":
				return createIPCError(
					IPCErrorCode.PERMISSION_DENIED,
					`Permission denied: ${error.path || "unknown"}`,
					{ originalError: error.message },
				);
			case "ENOSPC":
				return createIPCError(
					IPCErrorCode.DISK_FULL,
					"Disk is full or quota exceeded",
					{ originalError: error.message },
				);
			default:
				return createIPCError(
					IPCErrorCode.INTERNAL_ERROR,
					`File system error: ${error.message}`,
					{ code: error.code, originalError: error.message },
				);
		}
	}

	// Prisma errors
	if (isPrismaError(error)) {
		switch (error.code) {
			case "P2002":
				return createIPCError(
					IPCErrorCode.DUPLICATE_ENTRY,
					"A record with this value already exists",
					{ prismaCode: error.code },
				);
			case "P2025":
				return createIPCError(
					IPCErrorCode.NOT_FOUND,
					"Record not found in database",
					{ prismaCode: error.code },
				);
			default:
				return createIPCError(
					IPCErrorCode.DATABASE_ERROR,
					`Database error: ${error.message}`,
					{ prismaCode: error.code },
				);
		}
	}

	// Network errors
	if (error instanceof Error && error.message.includes("fetch")) {
		return createIPCError(
			IPCErrorCode.NETWORK_ERROR,
			`Network error: ${error.message}`,
		);
	}

	// Generic Error objects
	if (error instanceof Error) {
		return createIPCError(IPCErrorCode.INTERNAL_ERROR, error.message, {
			stack: error.stack,
		});
	}

	// Unknown error types
	return createIPCError(
		IPCErrorCode.INTERNAL_ERROR,
		"An unknown error occurred",
		{ error: String(error) },
	);
}

/**
 * Logs IPC errors with context
 */
export function logIPCError(
	channel: string,
	method: string,
	error: ErrorResponse,
): void {
	console.error(`[IPC Error] ${channel}.${method}`, {
		code: error.error.code,
		message: error.error.message,
		details: error.error.details,
	});
}

/**
 * Type guard for Node.js errors with code property
 */
function isNodeError(
	error: unknown,
): error is Error & { code: string; path?: string } {
	return (
		error instanceof Error &&
		"code" in error &&
		typeof (error as { code?: unknown }).code === "string"
	);
}

/**
 * Type guard for Prisma errors
 */
function isPrismaError(
	error: unknown,
): error is Error & { code: string; meta?: unknown } {
	return (
		error instanceof Error &&
		"code" in error &&
		typeof (error as { code?: unknown }).code === "string" &&
		(error as { code: string }).code.startsWith("P")
	);
}

/**
 * Validates input using a Zod schema and throws a structured error if invalid
 */
export function validateInput<T>(
	schema: { parse: (data: unknown) => T },
	data: unknown,
): T {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof ZodError) {
			throw error; // Will be caught by handleIPCError
		}
		throw new Error("Validation failed");
	}
}
