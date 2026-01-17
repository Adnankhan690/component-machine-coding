import TabProvider, { useTab } from "../../context/TabProvider";
import TabContent from "./TabContent";
import TabList from "./TabList";
import TabTrigger from "./TabTrigger";

export default function Tab({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<TabProvider>
				<div>{children}</div>
			</TabProvider>
		</div>
	);
}

Tab.TabList = TabList;
Tab.TabTrigger = TabTrigger;
Tab.TabContent = TabContent;
