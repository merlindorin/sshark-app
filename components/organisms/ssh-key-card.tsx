import { SSHKeyCardActions } from "@/components/molecules/ssh-key-card-actions"
import { SSHKeyCardHeader } from "@/components/molecules/ssh-key-card-header"
import { SSHKeyCodeBlock } from "@/components/molecules/ssh-key-code-block"
import type { SearchField } from "@/components/organisms/ssh-key-search"
import type { SSHKey } from "@/hooks/use-ssh-keys"

export type { SSHKey }

interface SSHKeyCardProps {
	sshKey: SSHKey
	onSearchClick?: (query: string, field: SearchField) => void
}

export function SSHKeyCard({ sshKey, onSearchClick }: SSHKeyCardProps) {
	return (
		<div className="space-y-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50">
			<div className="flex items-center justify-between gap-4">
				<SSHKeyCardHeader
					algorithm={sshKey.algorithm}
					onSearchClick={onSearchClick}
					provider={sshKey.source?.provider}
					username={sshKey.source?.username}
				/>
				<SSHKeyCardActions keyContent={sshKey.key_data} keyId={sshKey.id} sourceUri={sshKey.source?.uri} />
			</div>
			<SSHKeyCodeBlock algorithm={sshKey.algorithm} keyContent={sshKey.key_data} />
		</div>
	)
}
