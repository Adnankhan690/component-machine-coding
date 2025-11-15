import { createPortal } from "react-dom";
import usePopoverContext from "./context/context";
import "./popover.css";

export default function PopoverList({
	children,
}: {
	children?: React.ReactNode;
}) {
	const { showPopover, togglePopover, contentRef } = usePopoverContext();

    //NOTE: Avoid returning null if ref is empty instead use CSS to hide
    // if (!showPopover) return null;
    const className = showPopover ? "popover-list" : "popover-hide";

	return createPortal(
		<div className={className} ref={contentRef}>
			{children}
		</div>,
		document.body
	);
}
