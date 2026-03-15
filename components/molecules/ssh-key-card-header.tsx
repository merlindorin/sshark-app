import { KeyPill, ProviderPill, UserPill } from "@/components/molecules/home-pill"
import type { SearchField } from "@/components/organisms/ssh-key-search"

interface SSHKeyCardHeaderProps {
	username?: string
	provider?: string
	algorithm: string
	onSearchClick?: (query: string, field: SearchField) => void
}

export function SSHKeyCardHeader({ username, provider, algorithm, onSearchClick }: SSHKeyCardHeaderProps) {
	const handleSearchClick = (query: string, field: SearchField) => {
		if (onSearchClick) {
			onSearchClick(query, field)
		}
	}

	return (
		<div className="flex grow flex-wrap items-center gap-1">
			{provider && (
				<ProviderPill onClick={() => handleSearchClick(provider, "source.provider")} provider={provider} />
			)}
			{username && <UserPill onClick={() => handleSearchClick(username, "source.username")} user={username} />}
			<KeyPill keyType={algorithm} onClick={() => handleSearchClick(algorithm, "algorithm")} />
		</div>
	)
}
