import { ComponentType, LazyExoticComponent } from "react";

export default interface Tab {
	id: string;
	label: string;
	component:
		| React.ReactNode
		| ComponentType
		| LazyExoticComponent<ComponentType>;
	lazy?: boolean;
}

export interface TabsProps {
	tabs: Tab[];
	keepMounted?: boolean; // If true, keeps all rendered tabs in memory
	fallback?: React.ReactNode; // Custom loading component
}
