import { JSX, useEffect, useRef, useState } from "react";
import { OptimisedTabs as OptimisedTabsType } from "./types";
import Button, { ButtonProps } from "./Button";

interface OptimisedTabsProps {
	tabs: OptimisedTabsType[];
	initialActiveTab?: number;
}

// | Feature                               | Your Code | Real Lazy Loading           |
// | ------------------------------------- | --------- | --------------------------- |
// | Loads code only when needed           | ❌         | ✔                           |
// | Reduces JS bundle size                | ❌         | ✔                           |
// | Uses React.lazy + Suspense            | ❌         | ✔                           |
// | Prevents unvisited tabs from mounting | ✔         | ✔ (but with true lazy load) |
// | Keeps mounted components alive        | ✔         | Optional                    |

// This optimised Tabs is not lazy-loading instead it is lazy-mounting
// This is a better approach than normal Tabs(Conditonal mounting) because it avoids unnecessary mounting of unvisited tabs
// However, it does not reduce the JS bundle size as real lazy loading would do

//Read this -> https://www.notion.so/Component-fun-vs-React-Element-2c1ac9ff64a58028a73ae0e42914da07

export default function OptimisedTabs({
	tabs,
	initialActiveTab = 0,
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
		console.log(TabPanel);

		if (typeof TabPanel === "function") {
			const Component = TabPanel as React.ComponentType;
			return <Component />;
		}

		return TabPanel;
	};

	return (
		<div>
			{/* Tab List */}
			<div role="tablist" aria-label="Tab Navigation">
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

			{/* Tab Panels */}
			<div>
				{tabs.map((tab, index) => {
					return (
						<div
							role="tabpanel"
							id={`tabpanel-${index}`}
							aria-labelledby={`tab-${index}`}
							hidden={activeTab !== index}
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

{/* <div role="tablist" aria-label="Tab Navigation">
  // Identifies the container as a tab list
  // aria-label provides context for screen readers */}


{/* <div
  role="tabpanel"                    // Identifies as a tab panel
  id={`tabpanel-${index}`}          // Unique ID that matches aria-controls
  aria-labelledby={`tab-${index}`}  // Links back to the tab button
  hidden={activeTab !== index}       // Properly hides from assistive tech */}
