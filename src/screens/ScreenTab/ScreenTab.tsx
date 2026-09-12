import Tabs from "../../components/Tabs";
import { tabs } from "./constants";
import TabV2 from "./components/TabV2";



function ScreenTab() {
	return (
		<div>
			{/* <Tabs tabs={tabs} /> */}
			<TabV2 />
		</div>
	);
}

export default ScreenTab;
