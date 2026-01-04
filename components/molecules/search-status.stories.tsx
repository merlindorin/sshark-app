import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SearchStatus, STATUS } from "@/components/molecules/search-status"

const meta = {
	title: "Molecules/SearchStatus",
	component: SearchStatus,
	argTypes: {
		status: {
			description: "The current validation status",
			// @ts-expect-error // it is supported
			options: STATUS,
		},
		size: {
			description: "Icon size",
			control: "select",
			options: ["sm", "md", "lg"],
		},
		message: {
			description: "Tooltip message shown on hover",
			control: "text",
		},
	},
} satisfies Meta<typeof SearchStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
	args: {
		status: STATUS.LOADING,
		size: "md",
		message: "Validating query...",
	},
}

export const Success: Story = {
	args: {
		status: STATUS.SUCCESS,
		size: "md",
		message: "Query is valid",
	},
}

export const Failed: Story = {
	args: {
		status: STATUS.FAILED,
		size: "md",
		message: "Invalid query syntax",
	},
}

export const Unknown: Story = {
	args: {
		status: "unknown" as STATUS,
		size: "md",
		message: "Unknown status",
	},
}
