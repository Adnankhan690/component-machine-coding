import Popover from "@/components/Popover/Popover";
import { PopoverAction } from "@/components/Popover/PopoverAction";
import PopoverList from "@/components/Popover/PopoverList";
import PopoverMenuItem from "@/components/Popover/PopoverMenuItems";
import "./ScreenPopover.css"

export default function ScreenPopover() {
    return (
			<div className="screen-popover">
				<div>
					epsom salSodium Bicarbonate (Soda Ash) and Magnesium Sulphate (Epsom
					Salt) are not enumerated in Entry-9 of the VI Schedule, which covers
					dyes and chemicals. A Government Order directs a levy of 8% sales tax
					on all chemicals not covered under Entry-9. In a similar case, the
					erstwhile High Court of Judicature, Andhra Pradesh held that any
					chemical not enumerated in Entry-9 would fall under the Government
					Order and be taxable at 8% only, irrespective of its usage as a raw
					material. Consequently, the goods in question are to be taxed at 8% as
					they are chemicals not covered under Entry-9. The Revision Orders of
					the Joint Commissioner (CT) (Legal), Office of the Commissioner of
					Commercial Taxes, A.P, Hyderabad are set aside, and the petition is
					allowed.
				</div>
				<Popover>
					<PopoverAction>Click Me</PopoverAction>
					<PopoverList>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
						<PopoverMenuItem>Hello there</PopoverMenuItem>
					</PopoverList>
					<div>Hello world</div>
				</Popover>
			</div>
		);
}