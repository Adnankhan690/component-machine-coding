import ConditionalTab from "@/components/ConditionalTab/ConditionalTabs";
import { conditionalTabs, optimisedTabs, tabs } from "./constants";
import OptimisedTabs from "@/components/OptimisedTabs/OptimisedTabs";
import ComponentA from "./components/componentA/ComponentA";
import React, { Suspense } from "react";

const LazyComponentA = React.lazy(() => import("./components/componentA/ComponentA"));

function ScreenTab() {
	return (
		<div>
			{/* <Tabs tabs={tabs} /> */}

			<hr />

			{/* Non optimised Conditional Tabs: */}
			{/* <ConditionalTab tabs={conditionalTabs} /> */}

			{/* Custom lazy loading with optimised tab component: */}
			<OptimisedTabs tabs={optimisedTabs} />

			
			{/* Lazy loading example: */}
			{/* <Suspense fallback={<div>Loading Lazy Component A...</div>}>
				<LazyComponentA />
			</Suspense> */}

			{/* Non lazy loading example: */}
			{/* <ComponentA /> */}
		</div>
	);
}

export default ScreenTab;
