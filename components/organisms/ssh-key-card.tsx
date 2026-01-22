import { SSHKeyCodeBlock } from "@/components/molecules/ssh-key-code-block"
import { SSHKeyCardActions } from "@/components/molecules/ssh-key-card-actions"
import { SSHKeyCardHeader } from "@/components/molecules/ssh-key-card-header"

export interface SSHKey {
	id: string
	username: string
	source: string
	provider: string
	key: string
	options: string[]
	comment: string
	type: string
	updated_at: string
}

interface SSHKeyCardProps {
	sshKey: SSHKey
	onSearchClick?: (query: string) => void
}

export function SSHKeyCard({ sshKey, onSearchClick }: SSHKeyCardProps) {
	return (
		<div className="space-y-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50">
			<div className="flex items-center justify-between gap-4">
				<SSHKeyCardHeader
					onSearchClick={onSearchClick}
					provider={sshKey.provider}
					type={sshKey.type}
					username={sshKey.username}
				/>
				<SSHKeyCardActions keyContent={sshKey.key} keyId={sshKey.id} source={sshKey.source} />
			</div>
			<SSHKeyCodeBlock keyContent={sshKey.key} type={sshKey.type} />
		</div>
	)
}
