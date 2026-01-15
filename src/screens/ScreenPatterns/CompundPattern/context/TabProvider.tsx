import { createContext, SetStateAction, useContext, useState } from "react";

interface TabContext {
	activeTab: string;
	setActiveTab: React.Dispatch<SetStateAction<string>>;
}

const TabContext = createContext<TabContext | null>(null);

export default function TabProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [activeTab, setActiveTab] = useState("");

	return (
		<TabContext.Provider value={{ activeTab, setActiveTab }}>
			{children}
		</TabContext.Provider>
	);
}

export function useTab() {
	const context = useContext(TabContext);

	if (!context) {
		throw new Error("tab context must be used within Tab Provider");
	}

	return context;
}
