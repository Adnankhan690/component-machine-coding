import ConditionalTab from "@/components/ConditionalTab/ConditionalTabs";
import Tabs from "../../components/Tabs";
import { conditionalTabs, optimisedTabs, tabs } from "./constants";
import OptimisedTabs from "@/components/PracticeTab/OptimisedTabs";

function ScreenTab() {
	return (
		<div>
			{/* <Tabs tabs={tabs} /> */}

			<hr />

			{/* <ConditionalTab tabs={conditionalTabs} /> */}

			<OptimisedTabs tabs={optimisedTabs} />
		</div>
	);
}

export default ScreenTab;
