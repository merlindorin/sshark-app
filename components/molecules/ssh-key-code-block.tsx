interface SSHKeyCodeBlockProps {
	algorithm: string
	keyContent: string
}

export function SSHKeyCodeBlock({ algorithm, keyContent }: SSHKeyCodeBlockProps) {
	return (
		<div className="overflow-x-auto">
			<code className="block break-all rounded bg-muted px-3 py-2 font-mono text-foreground text-xs">
				{`${algorithm} ${keyContent}`}
			</code>
		</div>
	)
}
