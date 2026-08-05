import { useAuth } from "@clerk/nextjs"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiJson, authHeaders } from "@/lib/api-client"

type TaskStatus = "pending" | "running" | "succeeded" | "failed"
type TaskKind = "refresh_keys" | "revoke_key"

interface Task {
	id: string
	kind: TaskKind
	status: TaskStatus
	/** Steps completed, in whatever unit the task chose. */
	progress: number
	/** Steps in total, or 0 while the task does not yet know how much work there is. */
	total: number
	message?: string
	result?: Record<string, unknown>
	error?: string
	created_at: string
	started_at?: string
	finished_at?: string
}

interface RefreshResult {
	accounts?: number
	keys_added?: number
	keys_updated?: number
	keys_removed?: number
}

type GetTokenFn = () => Promise<string | null>

/** How often to ask again while a task is still going. */
const POLL_INTERVAL_MS = 1500

/** A task that has settled will not change again, so there is nothing left to poll for. */
function isSettled(task: Task | undefined): boolean {
	return task?.status === "succeeded" || task?.status === "failed"
}

const TASKS_QUERY_KEY = ["me", "tasks"] as const

const fetchTasks = (getToken: GetTokenFn) => {
	return async (): Promise<Task[]> => {
		const token = await getToken()
		const response = await apiJson<{ tasks: Task[] }>("/api/v1/me/tasks", 200, {
			headers: authHeaders(token),
		})
		return response.tasks
	}
}

const fetchTask = (getToken: GetTokenFn, id: string) => {
	return async (): Promise<Task> => {
		const token = await getToken()
		return apiJson<Task>(`/api/v1/me/tasks/${id}`, 200, { headers: authHeaders(token) })
	}
}

/**
 * Follows one task until it settles.
 *
 * Polling stops on its own once the task finishes, so a page left open does not keep asking
 * about work that is long done.
 */
const useTask = (id: string | null) => {
	const { getToken } = useAuth()

	return useQuery({
		queryKey: ["me", "tasks", id],
		queryFn: fetchTask(getToken, id ?? ""),
		enabled: Boolean(id),
		refetchInterval: (query) => (isSettled(query.state.data) ? false : POLL_INTERVAL_MS),
		// Keep polling when the tab is not focused. Otherwise switching away mid-refresh freezes
		// the panel at whatever it last said, and coming back shows stale progress until the
		// next interval. Bounded anyway: polling stops the moment the task settles.
		refetchIntervalInBackground: true,
	})
}

/**
 * The user's recent tasks.
 *
 * Polls only while something is still going, so an idle page settles into no traffic at all,
 * and keeps polling when the tab is not focused so switching away does not freeze the display.
 */
const useTasks = () => {
	const { getToken } = useAuth()

	return useQuery({
		queryKey: TASKS_QUERY_KEY,
		queryFn: fetchTasks(getToken),
		refetchInterval: (query) => {
			const active = (query.state.data ?? []).some((task) => !isSettled(task))
			return active ? POLL_INTERVAL_MS : false
		},
		refetchIntervalInBackground: true,
	})
}

/** Refetches the task list, for when something new has just been queued. */
const useReloadTasks = () => {
	const queryClient = useQueryClient()

	return () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
}

export { isSettled, useReloadTasks, useTask, useTasks }
export type { RefreshResult, Task, TaskKind, TaskStatus }
