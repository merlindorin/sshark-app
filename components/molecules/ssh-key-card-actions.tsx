import { CopyIcon, ExternalLink, MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SSHKeyCardActionsProps {
	keyId: string
	keyContent: string
	source: string
}

export function SSHKeyCardActions({ keyId, keyContent, source }: SSHKeyCardActionsProps) {
	const copyToClipboard = (key: string, _id: string) => {
		navigator.clipboard.writeText(key)
		toast.success("Copied to clipboard")
	}

	return (
		<div className="flex">
			<ButtonGroup>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="sm" variant="ghost">
							<MoreHorizontalIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => copyToClipboard(keyContent, keyId)}>
							<CopyIcon className="mr-0 h-1 w-10" /> Copy
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => window.open(source, "_blank")?.focus()}>
							<ExternalLink className="mr-0 h-1 w-10" /> Source
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</ButtonGroup>
		</div>
	)
}
