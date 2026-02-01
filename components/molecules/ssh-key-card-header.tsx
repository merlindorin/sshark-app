import type { SearchField } from "@/components/organisms/ssh-key-search"
import { KeyPill, ProviderPill, UserPill } from "@/components/molecules/home-pill"

interface SSHKeyCardHeaderProps {
	username: string
	provider: string
	type: string
	onSearchClick?: (query: string, field: SearchField) => void
}

export function SSHKeyCardHeader({ username, provider, type, onSearchClick }: SSHKeyCardHeaderProps) {
	const handleSearchClick = (query: string, field: SearchField) => {
		if (onSearchClick) {
			onSearchClick(query, field)
		}
	}

	return (
		<div className="flex grow flex-wrap items-center gap-1">
			<ProviderPill onClick={() => handleSearchClick(provider, "provider")} provider={provider} />
			<UserPill onClick={() => handleSearchClick(username, "username")} user={username} />
			<KeyPill keyType={type} onClick={() => handleSearchClick(type, "type")} />
		</div>
	)
}
