import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, CircleQuestionMark, LoaderCircle, type LucideProps } from "lucide-react"
import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export const STATUS = {
	UNKNOWN: "unknown",
	LOADING: "loading",
	SUCCESS: "success",
	FAILED: "failed",
} as const

export type STATUS = (typeof STATUS)[keyof typeof STATUS]

const searchStatusVariants = cva("", {
	variants: {
		size: {
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		},
	},
	defaultVariants: {
		size: "md",
	},
})

interface SearchStatusProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof searchStatusVariants> {
	status: STATUS
	message: string
}

export function SearchStatus({ status = STATUS.UNKNOWN, size = "md", message, ...props }: SearchStatusProps) {
	const sizeClassName = searchStatusVariants({ size })

	let classname: string
	let Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>

	switch (status) {
		case STATUS.LOADING:
			Icon = LoaderCircle
			classname = "animate-spin text-secondary"
			break
		case STATUS.SUCCESS:
			Icon = CheckCircle
			classname = "text-green-500"
			break
		case STATUS.FAILED:
			Icon = AlertCircle
			classname = "text-destructive"
			break
		default:
			Icon = CircleQuestionMark
			classname = "text-destructive"
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div {...props} className={cn(sizeClassName, props.className)}>
						<Icon className={cn(classname, sizeClassName)} />
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{message}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
