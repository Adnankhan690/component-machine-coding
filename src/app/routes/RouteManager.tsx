import { Routes as ReactRooutes, Route, BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import ScreenTab from "@/screens/ScreenTab/ScreenTab";
import Sidebar from "@/components/Sidebar/Sidebar";
import HomePage from "@/screens/HomePage/ScreenHomePage";
import ScreenInput from "@/screens/ScreenInput/ScreenInput";
import ScreenDialog from "@/screens/ScreenDialog/ScreenDialog";
import ScreenPopover from "@/screens/ScreenPopover/ScreenPopover";
import ScreenNestedFolder from "@/screens/NestedFolder/ScreenNestedFolder";

export default function RouteManager() {
	return (
		<BrowserRouter history={history}>
			<ReactRooutes>
				<Route path={Routes.HOME} element={<Sidebar />}>
					<Route path={Routes.SCREEN_TAB} element={<ScreenTab />} />
					<Route path={Routes.HOME} element={<HomePage />} />
					<Route path={Routes.SCREEN_INPUT} element={<ScreenInput />} />
					<Route path={Routes.SCREEN_DIALOG} element={<ScreenDialog />} />
					<Route path={Routes.SCREEN_POPOVER} element={<ScreenPopover />} />
					<Route path={Routes.SCREEN_NESTED_FOLDER} element={<ScreenNestedFolder />} />
				</Route>
			</ReactRooutes>
		</BrowserRouter>
	);
}
