import { usePopoverContextV1 } from "../context/ProviderPopoverV1";

export default function PopoverTriggerV1({ children }: { children: React.ReactNode }) {
    const { triggerBtnRef, togglePopover } = usePopoverContextV1();

    return (
        <button ref={triggerBtnRef} onClick={togglePopover}>
            {children}
        </button>
    )
}