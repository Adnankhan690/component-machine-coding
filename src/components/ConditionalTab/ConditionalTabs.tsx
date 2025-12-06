import { useState } from "react";
import { ConditionalTabs } from "../Tabs/types";
import Button, { ButtonProps } from "./Button";

interface ConditionalTabProp {
	tabs: ConditionalTabs[];
}

export default function ConditionalTab({ tabs }: ConditionalTabProp) {
	const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    }
    
	const ActiveTabPanel = tabs[activeTab].component;

	return (
		<div>
			<div role="Tabs">
				{tabs.map((tab, index) => {
					const buttonProps: ButtonProps = {
						active: activeTab === index,
						index: index,
						label: tab.label,
						onClick: handleTabChange,
					};
					return <Button {...buttonProps} key={index} />;
				})}
			</div>
			<div>
				{typeof ActiveTabPanel === "function" ? <ActiveTabPanel /> : ActiveTabPanel}
			</div>
		</div>
	);
}
