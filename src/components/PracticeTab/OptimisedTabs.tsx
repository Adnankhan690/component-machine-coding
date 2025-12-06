import { JSX, useEffect, useRef, useState } from "react";
import { OptimisedTabs as OptimisedTabsType } from "../Tabs/types";
import Button, { ButtonProps } from "./Button";

interface OptimisedTabsProps {
	tabs: OptimisedTabsType[];
	initialActiveTab?: number;
}

export default function OptimisedTabs({
	tabs,
	initialActiveTab = 2,
}: OptimisedTabsProps) {
	const [activeTab, setActiveTab] = useState(initialActiveTab);
	const renderedTabs = useRef(new Set<number>()).current;
	// ✅  Option 2 — Initialize Set directly
	// const renderedTabs = useRef(new Set<number>([0])).current;

	const handleTabChange = (index: number) => {
		setActiveTab(index);
		renderedTabs.add(index);
	};

	// Add initial tab to rendered set -> This does not harm but its conceptually wrong❌
	renderedTabs.add(initialActiveTab);

	//  ✅ Option 1 — Add initial tab in useEffect (best)
	// useEffect(() => {
	// 		renderedTabs.add(0);
	// 	}, []);

	const renderComponent = (tab: OptimisedTabsType, tabIndex: number) => {
		// ❌ Wrong - Because renderComponent receives a specific tab as an argument (its own panel), but you're not checking that tab’s index — you're checking only the currently active tab.
		// if (!renderedTabs.has(activeTab)) {
		// 	return null;
		// }

		// ✅ CORRECT - check if THIS specific tab has been rendered before
		if (!renderedTabs.has(tabIndex)) {
			return null;
		}

		const TabPanel = tab.component;

		if (typeof TabPanel === "function") {
			const Component = TabPanel as React.ComponentType;
			return <Component />;
		}

		return TabPanel;
	};

	return (
		<div>
			<div>
				{tabs.map((tab, index) => {
					const buttonProp: ButtonProps = {
						index: index,
						label: tab.label,
						active: activeTab === index,
						onClick: handleTabChange,
					};

					return <Button {...buttonProp} key={index} />;
				})}
			</div>

			<div>
				{tabs.map((tab, index) => {
					return (
						<div
							style={{ display: activeTab === index ? "block" : "none" }}
							key={index}>
							{renderComponent(tab, index)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
