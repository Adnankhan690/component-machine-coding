import { usePopoverContext } from "../context/ProviderContextv2";

export default function PopoverList({ children }: { children: React.ReactNode }) {
    const { buttonRef, onToggle } = usePopoverContext();


    return (
        <>
            {children}
        </>
    )
}