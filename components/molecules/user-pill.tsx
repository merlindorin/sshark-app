import { Pill, PillIcon } from "@/components/kibo-ui/pill"
import { UsersIcon } from "lucide-react"
import { MouseEventHandler } from "react"

export function UserPill({user, onClick}: { user: string, onClick: MouseEventHandler }) {
    return (
        <Pill className="cursor-pointer" onClick={onClick}>
            <PillIcon icon={UsersIcon}/>
            {user}
        </Pill>
    )
}
