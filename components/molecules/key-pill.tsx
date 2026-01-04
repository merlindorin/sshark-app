import { KeyIcon } from "lucide-react"
import type { MouseEventHandler } from "react"
import { Pill, PillIcon } from "@/components/kibo-ui/pill"

export function KeyPill({ keyType, onClick }: { keyType: string; onClick: MouseEventHandler }) {
	return (
		<Pill className="cursor-pointer" onClick={onClick}>
			<PillIcon icon={KeyIcon} />
			{keyType}
		</Pill>
	)
}
