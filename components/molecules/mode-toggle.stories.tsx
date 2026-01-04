import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ModeToggle } from "./mode-toggle"

const meta = {
	component: ModeToggle,
} satisfies Meta<typeof ModeToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
