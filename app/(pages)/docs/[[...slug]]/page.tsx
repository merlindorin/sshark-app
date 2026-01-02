import { Page, PageContent, PageHeader } from "@/components/pages/page"
import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'
import { DocsBody } from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export default async function Doc(props: PageProps<'/docs/[[...slug]]'>) {
    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    const MDX = page.data.body

    return (
        <Page>
            <PageHeader title={page.data.title} description={page.data.description}/>
            <PageContent>
                <DocsBody>
                    <MDX
                        components={getMDXComponents({
                            // this allows you to link to other pages with relative file paths
                            a: createRelativeLink(source, page),
                        })}
                    />
                </DocsBody>
            </PageContent>
        </Page>
    )
}

export async function generateStaticParams() {
    return source.generateParams()
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description,
    }
}