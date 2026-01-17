import { useTab } from "../../context/TabProvider";

export default function TabContent({
	children,
	value,
	className,
}: {
	children: React.ReactNode;
	value: string;
	className?: string;
}) {
	const { activeTab } = useTab();

	return <div className={className}>{value === activeTab && children}</div>;
}
