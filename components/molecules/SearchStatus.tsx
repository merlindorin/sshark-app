import {AlertCircle, CheckCircle, CircleQuestionMark, LoaderCircle, LucideProps} from "lucide-react"
import React from "react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils"
import {cva, VariantProps} from "class-variance-authority"

export enum Status {
    Unknown = "unknown",
    Loading = "loading",
    Success = "success",
    Failed = "failed",
}

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

interface SearchStatusProps extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof searchStatusVariants> {
    status: Status
    message: string
}

export function SearchStatus({status = Status.Unknown, size = "md", message, ...props}: SearchStatusProps) {
    const sizeClassName = searchStatusVariants({size})

    let classname: string
    let Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>

    switch (status) {
        case Status.Loading:
            Icon = LoaderCircle
            classname = "animate-spin text-secondary"
            break
        case Status.Success:
            Icon = CheckCircle
            classname = "text-green-500"
            break
        case Status.Failed:
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
                        <Icon className={cn(classname, sizeClassName)}/>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}