import { useTab } from "../../context/TabProvider";

export default function TabContent({
	children,
	value,
}: {
	children: React.ReactNode;
	value: string;
}) {
	const { activeTab } = useTab();

	return <div>{value === activeTab && children}</div>;
}
