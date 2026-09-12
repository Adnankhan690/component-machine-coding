import { useState } from "react";
import "./tab-v2.css";

interface Tab {
	id: string;
	label: string;
	content: string;
	disabled?: boolean;
}

const tabs: Tab[] = [
	{
		id: "overview",
		label: "Overview",
		content: "Welcome to the dashboard overview section.",
	},
	{
		id: "analytics",
		label: "Analytics",
		content: "View your weekly and monthly traffic statistics.",
	},
	{
		id: "settings",
		label: "Settings",
        content: "Manage your account preferences and notifications.",
        disabled: false,
	},
	{
		id: "billing",
		label: "Billing",
		content: "View past invoices and update payment methods.",
		disabled: true,
	},
];

export default function TabV2() {
	const [activeTab, setActiveTab] = useState(tabs[0].id);

	const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

	const handleClickTab = (id: string) => {
		setActiveTab(id);
	};

	return (
		<div>
			<div className="tab-con" role="tablist">
				{tabs.map((tab, idx) => {
					const isActive = activeTab === tab.id;
					return (
						<div key={tab.id}>
							<button
								onClick={() => {
									!tab.disabled && handleClickTab(tab.id);
								}}
								className="btn-con"
								disabled={tab.disabled}
								aria-selected={isActive}
								aria-controls={`panel-${tab.id}`}
								role="tab">
								{tab.label}
							</button>
						</div>
					);
				})}
			</div>
			<div id={`panel-${activeTab}`} role="tabpanel">
				{currentTab.content}
			</div>
		</div>
	);
}
