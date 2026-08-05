import { usePopoverContext } from "../context/ProviderContextv2";

export default function PopoverTrigger({ children }: { children: React.ReactNode }) {
    const { buttonRef, onToggle } = usePopoverContext();

    return (
        <button ref={buttonRef} onClick={onToggle}>
            {children}
        </button>
    )
}
