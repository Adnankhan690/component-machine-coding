import "../popoverV1.css";
import { usePopoverContextV1 } from "../context/ProviderPopoverV1";
import { createPortal } from "react-dom";

export default function PopoverListV1({ children }: { children: React.ReactNode }) {
    const { showPopover, contentRef } = usePopoverContextV1();

    const className = showPopover ? "popover-list" : "hide-popover";

    // if (!showPopover) return null;

    return createPortal(
        <div className={className} ref={contentRef}>
            {children}
        </div>,
        document.body
    );
}