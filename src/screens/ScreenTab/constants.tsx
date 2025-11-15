import Tab from "../../components/Tabs/types";
import ComponentA from "./components/componentA/ComponentA";
import ComponentB from "./components/ComponentB/ComponentB";
import ComponentC from "./components/componentC/ComponentC";

export const tabs: Tab[] = [
	{ id: "1", label: "Tab 1", component: ComponentA },
	{ id: "2", label: "Tab 2", component: ComponentB },
	{ id: "3", label: "Tab 3", component: <ComponentC /> },
];
