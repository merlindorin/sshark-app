import { Pill, PillIcon } from "@/components/kibo-ui/pill"
import { KeyIcon } from "lucide-react"
import { MouseEventHandler } from "react"

export function KeyPill({keyType, onClick}: { keyType: string, onClick: MouseEventHandler }) {
    return (
        <Pill onClick={onClick} className="cursor-pointer">
            <PillIcon icon={KeyIcon}/>
            {keyType}
        </Pill>
    )
}
