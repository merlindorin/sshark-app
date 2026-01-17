import { KeyPill, ProviderPill, UserPill } from "@/components/molecules/home-pill"

interface SSHKeyCardHeaderProps {
	username: string
	provider: string
	type: string
	onSearchClick?: (query: string) => void
}

export function SSHKeyCardHeader({ username, provider, type, onSearchClick }: SSHKeyCardHeaderProps) {
	const handleSearchClick = (query: string) => {
		if (onSearchClick) {
			onSearchClick(query)
		}
	}

	return (
		<div className="grow flex flex-wrap items-center gap-1">
			<ProviderPill onClick={() => handleSearchClick(`@provider:{${provider}}`)} provider={provider} />
			<UserPill
				onClick={() => handleSearchClick(`@username:{${username.replaceAll("-", "\\-")}}`)}
				user={username}
			/>
			<KeyPill keyType={type} onClick={() => handleSearchClick(`@type:{${type.replaceAll("-", "\\-")}}`)} />
		</div>
	)
}
