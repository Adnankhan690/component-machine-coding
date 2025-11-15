import usePopoverContext, { ProviderPopover } from "./context/context";
import "./popover.css";

export default function Popover({ children }: { children?: React.ReactNode }) {
    return (
			<div className="popover">
				<ProviderPopover>{children}</ProviderPopover>
			</div>
		);
}
