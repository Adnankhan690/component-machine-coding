import { useEffect } from "react";
import { useTab } from "../../context/TabProvider";

export default function TabTrigger({
	children,
	value,
	defaultTab,
	className,
	activeClassName,
}: {
	children: React.ReactNode;
	value: string;
	defaultTab?: boolean;
	className?: string;
	activeClassName?: string;
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

	const isActive = activeTab === value;

	return (
		<button
			className={`${className} ${isActive ? activeClassName : ""}`}
			onClick={handleClick}>
			{children}
		</button>
	);
}
