import TabProvider, { useTab } from "../../context/TabProvider";

export default function Tab({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<TabProvider>
				<div>{children}</div>
			</TabProvider>
		</div>
	);
}
