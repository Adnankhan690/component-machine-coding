import "../popoverv2.css";

import { createPortal } from "react-dom";
import { usePopoverContext } from "../context/ProviderContextv2";

export default function PopoverList({ children }: { children: React.ReactNode }) {
    const { contentRef, showPopover } = usePopoverContext();


    const className = showPopover ? "show-list" : "hide-list";

    return createPortal(
        <div ref={contentRef} className={className}>
            {children}
        </div>,
        document.body
    )
}