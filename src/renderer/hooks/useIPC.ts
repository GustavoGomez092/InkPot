/**
 * React hooks for IPC communication with main process
 */

import type {
	AppPathsResponse,
	AppVersionResponse,
	ErrorResponse,
	IPCResponse,
	RecentProject,
	ThemeData,
	ThemeSummary,
} from "@shared/types/ipc-contracts.js";
import { useCallback, useEffect, useState } from "react";

/**
 * Get the electron API from window
 */
function getElectronAPI() {
	if (typeof window !== "undefined" && "electronAPI" in window) {
		return window.electronAPI as typeof window.electronAPI;
	}
	return null;
}

/**
 * Hook for listing recent projects
 */
export function useRecentProjects(limit = 20) {
	const [data, setData] = useState<IPCResponse<RecentProject[]> | null>(null);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		const api = getElectronAPI();
		if (!api) {
			setError({
				success: false,
				error: { code: "ENOENT", message: "Electron API not available" },
			});
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await api.projects.listRecent({ limit });
			if (result.success) {
				// @ts-expect-error - Type mismatch between API response and state type
				setData(result);
			} else {
				setError(result);
			}
		} catch (err) {
			setError({
				success: false,
				error: {
					code: "UNKNOWN",
					message: err instanceof Error ? err.message : "Unknown error",
				},
			});
		} finally {
			setLoading(false);
		}
	}, [limit]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { data, error, loading, refresh };
}

/**
 * Hook for listing themes
 */
export function useThemes(includeBuiltIn = true) {
	const [data, setData] = useState<IPCResponse<ThemeSummary[]> | null>(null);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		const api = getElectronAPI();
		if (!api) {
			setError({
				success: false,
				error: { code: "ENOENT", message: "Electron API not available" },
			});
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await api.themes.list({ includeBuiltIn });
			if (result.success) {
				setData(result);
			} else {
				setError(result);
			}
		} catch (err) {
			setError({
				success: false,
				error: {
					code: "UNKNOWN",
					message: err instanceof Error ? err.message : "Unknown error",
				},
			});
		} finally {
			setLoading(false);
		}
	}, [includeBuiltIn]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { data, error, loading, refresh };
}

/**
 * Hook for getting a single theme
 */
export function useTheme(themeId: string | null) {
	const [data, setData] = useState<IPCResponse<ThemeData> | null>(null);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (!themeId) return;

		const api = getElectronAPI();
		if (!api) {
			setError({
				success: false,
				error: { code: "ENOENT", message: "Electron API not available" },
			});
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await api.themes.get({ id: themeId });
			if (result.success) {
				setData(result);
			} else {
				setError(result);
			}
		} catch (err) {
			setError({
				success: false,
				error: {
					code: "UNKNOWN",
					message: err instanceof Error ? err.message : "Unknown error",
				},
			});
		} finally {
			setLoading(false);
		}
	}, [themeId]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { data, error, loading, refresh };
}

/**
 * Hook for getting app version
 */
export function useAppVersion() {
	const [data, setData] = useState<IPCResponse<AppVersionResponse> | null>(
		null,
	);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const api = getElectronAPI();
		if (!api) {
			setError({
				success: false,
				error: { code: "ENOENT", message: "Electron API not available" },
			});
			setLoading(false);
			return;
		}

		api.app
			.version()
			.then((result) => {
				if (result.success) {
					setData(result);
				} else {
					setError(result);
				}
			})
			.catch((err) => {
				setError({
					success: false,
					error: {
						code: "UNKNOWN",
						message: err instanceof Error ? err.message : "Unknown error",
					},
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { data, error, loading };
}

/**
 * Hook for getting app paths
 */
export function useAppPaths() {
	const [data, setData] = useState<IPCResponse<AppPathsResponse> | null>(null);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const api = getElectronAPI();
		if (!api) {
			setError({
				success: false,
				error: { code: "ENOENT", message: "Electron API not available" },
			});
			setLoading(false);
			return;
		}

		api.app
			.paths({})
			.then((result) => {
				if (result.success) {
					setData(result);
				} else {
					setError(result);
				}
			})
			.catch((err) => {
				setError({
					success: false,
					error: {
						code: "UNKNOWN",
						message: err instanceof Error ? err.message : "Unknown error",
					},
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { data, error, loading };
}
