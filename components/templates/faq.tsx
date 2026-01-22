import type { AccordionSingleProps } from "@radix-ui/react-accordion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const faqs = [
	{
		question: "What is SSHark?",
		answer: "SSHark is a search engine for public SSH keys. It indexes SSH keys from platforms like GitHub, GitLab, and others, allowing you to search by username, reverse lookup key ownership, or filter by encryption type.",
	},
	{
		question: "How do I search for a user's SSH keys?",
		answer: "Simply enter a username in the search box. For example, searching 'merlin' will find all matching usernames and their public SSH keys. You can also use advanced queries like @username:{merlindorin} for exact matches or @username:{merl*} for wildcard searches.",
	},
	{
		question: "What is reverse lookup?",
		answer: "Reverse lookup lets you find who owns a specific SSH key. Just paste the key content (e.g., AAAAC3NzaC1lZD...) into the search box, and SSHark will show which user owns that key across indexed platforms.",
	},
	{
		question: "What platforms does SSHark index?",
		answer: "SSHark currently indexes public SSH keys from GitHub, GitLab, and other platforms. The database is regularly updated to ensure you have access to the latest public keys.",
	},
	{
		question: "What search fields are available?",
		answer: "SSHark supports advanced search with fields including @username (owner), @key (key content), @source (platform like github/gitlab), @provider, @type (encryption type like ssh-rsa, ssh-ed25519, ecdsa-sha2-nistp256), @comment, and @id. Use syntax like @source:{github|gitlab} to search multiple values.",
	},
	{
		question: "Is SSHark free to use?",
		answer: "Yes, SSHark is completely free to use. All public SSH keys are indexed and searchable at no cost. The service is designed to be developer-friendly and accessible to everyone.",
	},
]

export function FAQ({ className, ...props }: Omit<AccordionSingleProps, "type" | "collapsible">) {
	return (
		<Accordion className={cn(className, "w-full")} collapsible type="single" {...props}>
			{faqs.map((faq, index) => (
				<AccordionItem key={index} value={`item-${index}`}>
					<AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}
