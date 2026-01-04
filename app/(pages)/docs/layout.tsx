import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: LayoutProps<"/docs">) {
	return (
		<DocsLayout
			containerProps={{ className: "flex flex-col" }}
			sidebar={{ enabled: false }}
			tree={source.getPageTree()}
			{...baseOptions()}>
			{children}
		</DocsLayout>
	)
}
