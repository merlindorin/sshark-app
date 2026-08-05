"use client"

import { AlertCircle, CheckCircle2, ListChecks, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import {
	PageSection,
	PageSectionContent,
	PageSectionHeader,
	PageSectionParagraph,
	PageSectionTitle,
} from "@/components/pages/page"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useReloadMyKeys } from "@/hooks/use-my-keys"
import type { RefreshResult, Task, TaskKind } from "@/hooks/use-tasks"
import { isSettled, useTasks } from "@/hooks/use-tasks"

/** How many to show. Enough to see what just happened without becoming a log. */
const VISIBLE_TASKS = 8

const PERCENT = 100

const TASK_LABELS: Record<TaskKind, string> = {
	refresh_keys: "Refresh keys",
	revoke_key: "Revoke key",
}

/** Kinds whose completion changes the key list, so it is worth reloading when they finish. */
const AFFECTS_KEYS: ReadonlySet<string> = new Set<TaskKind>(["refresh_keys", "revoke_key"])

function labelFor(task: Task): string {
	return TASK_LABELS[task.kind] ?? task.kind
}

function formatWhen(iso: string): string {
	return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

/** Turns a result into a sentence, since raw counts mean little on their own. */
function summarise(task: Task): string | null {
	if (task.status !== "succeeded" || !task.result) {
		return null
	}

	if (task.kind === "refresh_keys") {
		const result = task.result as RefreshResult
		const added = result.keys_added ?? 0
		const updated = result.keys_updated ?? 0
		const removed = result.keys_removed ?? 0

		if (added === 0 && updated === 0 && removed === 0) {
			return "Already up to date"
		}

		return [
			added > 0 ? `${added} added` : null,
			updated > 0 ? `${updated} updated` : null,
			removed > 0 ? `${removed} removed` : null,
		]
			.filter(Boolean)
			.join(", ")
	}

	return "Done"
}

function StatusBadge({ task }: { task: Task }) {
	if (task.status === "succeeded") {
		return (
			<Badge variant="secondary">
				<CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
				Succeeded
			</Badge>
		)
	}

	if (task.status === "failed") {
		return (
			<Badge variant="destructive">
				<AlertCircle className="mr-1 h-3 w-3" />
				Failed
			</Badge>
		)
	}

	return (
		<Badge variant="outline">
			<Loader2 className="mr-1 h-3 w-3 animate-spin" />
			{task.status === "pending" ? "Queued" : "Running"}
		</Badge>
	)
}

function ProgressCell({ task }: { task: Task }) {
	if (isSettled(task)) {
		return <span className="text-muted-foreground text-xs">{summarise(task) ?? task.error ?? "—"}</span>
	}

	if (task.total <= 0) {
		return <span className="text-muted-foreground text-xs">{task.message ?? "Working..."}</span>
	}

	const percent = Math.min(PERCENT, Math.round((task.progress / task.total) * PERCENT))

	return (
		<div className="min-w-32 space-y-1">
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary transition-all duration-300"
					style={{ width: `${percent}%` }}
				/>
			</div>
			<span className="text-muted-foreground text-xs tabular-nums">
				{task.progress}/{task.total}
			</span>
		</div>
	)
}

/**
 * Reloads the key list once a task that changed it finishes.
 *
 * The work happens on the server, so nothing else in the UI knows the keys moved. Tracking which
 * ids have been acted on stops a settled task triggering a reload on every render.
 */
function useReloadOnSettled(tasks: Task[]) {
	const reloadKeys = useReloadMyKeys()
	const handled = useRef(new Set<string>())

	useEffect(() => {
		const finished = tasks.filter(
			(task) => isSettled(task) && AFFECTS_KEYS.has(task.kind) && !handled.current.has(task.id),
		)

		if (finished.length === 0) {
			return
		}

		for (const task of finished) {
			handled.current.add(task.id)
		}
		reloadKeys()
	}, [tasks, reloadKeys])
}

/**
 * Everything SSHark is doing, or recently did, for this user.
 *
 * Tasks live here rather than beside whatever triggered them: a refresh and a revocation are the
 * same kind of thing to watch, and a new kind should have somewhere to appear without another
 * section growing a progress bar of its own.
 */
export function TasksSection() {
	const { data: tasks, isLoading } = useTasks()
	useReloadOnSettled(tasks ?? [])

	if (isLoading) {
		return (
			<PageSection>
				<Skeleton className="h-48 w-full rounded-xl" />
			</PageSection>
		)
	}

	const recent = (tasks ?? []).slice(0, VISIBLE_TASKS)

	return (
		<PageSection>
			<PageSectionHeader>
				<PageSectionTitle>Activity</PageSectionTitle>
				<PageSectionParagraph>
					What SSHark is doing for you. Work runs in the background, so you can leave this page and come back
					to it.
				</PageSectionParagraph>
			</PageSectionHeader>
			<PageSectionContent>
				{recent.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-10">
							<ListChecks className="mb-3 h-10 w-10 text-muted-foreground" />
							<p className="text-center text-muted-foreground text-sm">
								Nothing running. Refreshing or revoking a key will show up here.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Task</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Progress</TableHead>
									<TableHead>Started</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recent.map((task) => (
									<TableRow key={task.id}>
										<TableCell>
											<div className="font-medium">{labelFor(task)}</div>
											{!isSettled(task) && task.message && (
												<div className="text-muted-foreground text-xs">{task.message}</div>
											)}
										</TableCell>
										<TableCell>
											<StatusBadge task={task} />
										</TableCell>
										<TableCell>
											<ProgressCell task={task} />
										</TableCell>
										<TableCell className="text-muted-foreground text-xs tabular-nums">
											{formatWhen(task.created_at)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</PageSectionContent>
		</PageSection>
	)
}
