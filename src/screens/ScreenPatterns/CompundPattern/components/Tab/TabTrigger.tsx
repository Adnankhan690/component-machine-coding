import { useEffect } from "react";
import { useTab } from "../../context/TabProvider";

export default function TabTrigger({
	children,
	value,
	defaultTab,
}: {
	children: React.ReactNode;
	value: string;
	defaultTab?: boolean;
}) {
	const { activeTab, setActiveTab } = useTab();
	const handleClick = () => {
		setActiveTab(value);
	};

	useEffect(() => {
		if (defaultTab) {
			setActiveTab(value);
		}
	}, [defaultTab]);

	return (
		<div>
			<button onClick={handleClick}>{children}</button>
		</div>
	);
}
