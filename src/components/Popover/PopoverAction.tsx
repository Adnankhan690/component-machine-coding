import usePopoverContext from "./context/context";

interface PopoverActionProps {
	children?: React.ReactNode;
	btnLabel?: string;
	node?: React.ReactNode;
}

export function PopoverAction({
	node,
	btnLabel,
	children,
}: PopoverActionProps) {
	const { showPopover, togglePopover, actionButtonRef } = usePopoverContext();

	const className = "popover-action";

	if (node) {
		return (
			<button
				ref={actionButtonRef}
				className={className}
				onClick={togglePopover}>
				{node}
			</button>
		);
	}

	if (children) {
		return (
			<button
				ref={actionButtonRef}
				className={className}
				onClick={togglePopover}>
				{children}
			</button>
		);
	}

	return (
		<button ref={actionButtonRef} className={className} onClick={togglePopover}>
			{btnLabel}
		</button>
	);
}
