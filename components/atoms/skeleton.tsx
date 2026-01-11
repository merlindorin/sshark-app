import { Box, type BoxProps } from "@/components/atoms/box"
import { cn } from "@/lib/utils"

function Skeleton({ className, rounded = "md", bg = "accent", ...props }: BoxProps) {
	return <Box bg={bg} className={cn("animate-pulse", className)} data-slot="skeleton" rounded={rounded} {...props} />
}

export { Skeleton }
