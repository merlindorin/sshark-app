import { UsersIcon } from "lucide-react"
import type { MouseEventHandler } from "react"
import { Pill, PillIcon } from "@/components/kibo-ui/pill"

export function UserPill({ user, onClick }: { user: string; onClick: MouseEventHandler }) {
	return (
		<Pill className="cursor-pointer" onClick={onClick}>
			<PillIcon icon={UsersIcon} />
			{user}
		</Pill>
	)
}
