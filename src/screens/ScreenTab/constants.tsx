import React from "react";
import Tab, {
	ConditionalTabs,
	OptimisedTabs,
} from "../../components/Tabs/types";
import ComponentA from "./components/componentA/ComponentA";
import ComponentB from "./components/ComponentB/ComponentB";
import ComponentC from "./components/componentC/ComponentC";

export const tabs: Tab[] = [
	{ id: "1", label: "Tab 1", component: ComponentA },
	{ id: "2", label: "Tab 2", component: ComponentB },
	{ id: "3", label: "Tab 3", component: <ComponentC /> },
];

export const conditionalTabs: ConditionalTabs[] = [
	{
		id: "1",
		label: "Tab A",
		component: ComponentA,
	},
	{
		id: "2",
		label: "Tab B",
		component: <ComponentB />,
	},
	{
		id: "3",
		label: "Tab C",
		component: ComponentC,
	},
];

export const optimisedTabs: OptimisedTabs[] = [
	{
		id: "1",
		label: "Tab A",
		component: ComponentA,
		// OR
		// component: function ComponentA() {
		// 	return <div>Optimised Tab A Content</div>;
		// },
	},
	{
		id: "2",
		label: "Tab B",
		component: <ComponentB />,
	},
	{
		id: "3",
		label: "Tab C",
		component: ComponentC,
	},
];
