import { Suspense, useState, useRef } from "react";
import Tab from "./components/Tab";
import "./tabs.css";
import TabType, { TabsProps } from "./types";

function DefaultFallback() {
	return <div className="tab-loading">Loading...</div>;
}

function Tabs({ 
	tabs = [],
	keepMounted = true,
	fallback = <DefaultFallback />,
}: TabsProps) {
	const [activeTab, setActiveTab] = useState(0);
	// Keep track of rendered tabs
	const renderedTabs = useRef(new Set<number>()).current;

	const handleTabChange = (tabIndex: number) => {
		setActiveTab(tabIndex);
		renderedTabs.add(tabIndex);
	};

	// Add initial tab to rendered set
	if (!renderedTabs.has(activeTab)) {
		renderedTabs.add(activeTab);
	}

	const renderComponent = (
		component: React.ReactNode | React.ComponentType,
		index: number
	) => {
		// Skip rendering if tab hasn't been activated yet and we're not keeping all mounted
		if (!keepMounted && !renderedTabs.has(index)) {
			return null;
		}

		// Handle lazy loaded components
		// if (typeof component === "object" && "then" in component) {
		// 	return <Suspense fallback={fallback}>{component}</Suspense>;
		// }

		// Handle regular components
		if (typeof component === "function") {
			const Component = component as React.ComponentType;
			return <Component />;
		}

		return component;
	};

	return (
		<div className="tabs-container">
			<div role="tablist" aria-label="Content tabs" className="tabs-button-con">
				{tabs.map((tab, index) => {
					const tabProp = { ...tab, index, isActive: index === activeTab };
					return (
						<Tab key={tab.id} {...tabProp} handleTabChange={handleTabChange} />
					);
				})}
			</div>
			{tabs.map((tab, index) => (
				<div
					key={tab.id}
					role="tabpanel"
					aria-labelledby={`tab-${tab.id}`}
					className="tab-content"
					tabIndex={0}
					style={{ display: index === activeTab ? "block" : "none" }}
				>
					{renderComponent(tab.component, index)}
				</div>
			))}
		</div>
	);
}

export default Tabs;
