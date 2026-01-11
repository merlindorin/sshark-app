import { CopyIcon, ExternalLink, Key, LucideLoaderCircle, MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"
import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { P, Span } from "@/components/atoms/text"
import { KeyPill } from "@/components/molecules/key-pill"
import { ProviderPill } from "@/components/molecules/provider-pill"
import { UserPill } from "@/components/molecules/user-pill"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SearchResponse } from "@/hooks/use-ssh-keys"

export function SSHKeyResults({
	searchQuery,
	data,
	searchFn,
	searchIsError,
	searchIsFetching,
}: {
	searchQuery: string
	searchFn: (s: string) => void
	searchIsError: boolean
	searchIsFetching: boolean
	data: SearchResponse | undefined
}) {
	const copyToClipboard = (key: string, _id: string) => {
		navigator.clipboard.writeText(key)
		toast.success("Copied to clipboard")
	}

	if (searchIsError) {
		return (
			<Card className="w-full border-border bg-card">
				<CardContent className="py-12 text-center">
					<Key className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<P fontWeight="medium" textColor="foreground" textSize="lg">
						Oops
					</P>
					<P mt={2} textColor="muted-foreground" textSize="sm">
						Something goes wrong
					</P>
				</CardContent>
			</Card>
		)
	}

	if (searchIsFetching) {
		return (
			<Card className="w-full border-border bg-card">
				<CardContent className="py-12 text-center">
					<LucideLoaderCircle className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
					<P fontWeight="medium" textColor="foreground" textSize="lg">
						Searching...
					</P>
				</CardContent>
			</Card>
		)
	}

	if (data === undefined) {
		return null
	}

	if (data.entities.length === 0) {
		return (
			<Card className="w-full border-border bg-card">
				<CardContent className="py-12 text-center">
					<Key className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<P fontWeight="medium" textColor="foreground" textSize="lg">
						No SSH keys found
					</P>
					<P mt={2} textColor="muted-foreground" textSize="sm">
						No public SSH keys found for query &quot;{searchQuery}&quot;
					</P>
				</CardContent>
			</Card>
		)
	}

	const _hasExactMatch = true

	return (
		<Card className="w-full border-border bg-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-xl">
					<Key className="h-5 w-5" />
					Public SSH Keys for{" "}
					<Span className="font-mono" textColor="primary">
						{searchQuery}
					</Span>
				</CardTitle>
				<P textColor="muted-foreground" textSize="sm">
					Found {data?.entities.length} public SSH key
					{data?.entities.length !== 1 ? "s" : ""} across platforms
				</P>
			</CardHeader>
			<CardContent className="space-y-4">
				{data?.entities.map((sshKey) => {
					return (
						<Box
							bg="background"
							border={1}
							borderColor="border"
							className="transition-colors hover:bg-muted/50"
							key={sshKey.id}
							p={4}
							rounded="lg"
							spaceY={3}
						>
							<Flex align="center" gap={4} justify="between">
								<Flex align="center" gap={1} grow="true" wrap="wrap">
									<ProviderPill
										onClick={() => searchFn(`@provider:{${sshKey.provider}}`)}
										provider={sshKey.provider}
									/>
									<UserPill
										onClick={() =>
											searchFn(`@username:{${sshKey.username.replaceAll("-", "\\-")}}`)
										}
										user={sshKey.username}
									/>
									<KeyPill
										keyType={sshKey.type}
										onClick={() => searchFn(`@type:{${sshKey.type.replaceAll("-", "\\-")}}`)}
									/>
								</Flex>
								<Flex>
									<ButtonGroup>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="sm" variant="ghost">
													<MoreHorizontalIcon />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => copyToClipboard(sshKey.key, sshKey.id)}>
													<CopyIcon className="mr-0 h-1 w-10" /> Copy
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => window.open(sshKey.source, "_blank")?.focus()}
												>
													<ExternalLink className="mr-0 h-1 w-10" /> Source
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</ButtonGroup>
								</Flex>
							</Flex>
							<Box className="overflow-x-auto">
								<code className="block break-all rounded bg-muted px-3 py-2 font-mono text-foreground text-xs">
									{`${sshKey.type} ${sshKey.key}`}
								</code>
							</Box>
						</Box>
					)
				})}
			</CardContent>
		</Card>
	)
}
