interface SSHKeyCodeBlockProps {
	type: string
	keyContent: string
}

export function SSHKeyCodeBlock({ type, keyContent }: SSHKeyCodeBlockProps) {
	return (
		<div className="overflow-x-auto">
			<code className="block break-all rounded bg-muted px-3 py-2 font-mono text-foreground text-xs">
				{`${type} ${keyContent}`}
			</code>
		</div>
	)
}
