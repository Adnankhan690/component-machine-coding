import { Routes as ReactRooutes, Route, BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import ScreenTab from "@/screens/ScreenTab/ScreenTab";
import Sidebar from "@/components/Sidebar/Sidebar";
import HomePage from "@/screens/HomePage/ScreenHomePage";
import ScreenInput from "@/screens/ScreenInput/ScreenInput";
import ScreenDialog from "@/screens/ScreenDialog/ScreenDialog";
import ScreenPopover from "@/screens/ScreenPopover/ScreenPopover";
import ScreenNestedFolder from "@/screens/NestedFolder/ScreenNestedFolder";
import ScreenPropsDemo from "@/screens/ScreenPropsDemo/ScreenPropsDemo";
import ScreenRenderPropPattern from "@/screens/ScreenRenderPropPattern/ScreenRenderPropPattern";
import ScreenChildrenPattern from "@/screens/ScreenChildren/ScreenChildrenPattern";
import ScreenProgressbar from "@/screens/ScreenProgressbar/ScreenProgressbar";
import ScreenMemoization from "@/screens/ScreenMemoization/ScreenMemoization";
import ScreenTimer from "@/screens/ScreenTimer/ScreenTimer";
import StartRating from "@/screens/ScreenStartRating/ScreenStartRating";

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
					<Route
						path={Routes.SCREEN_NESTED_FOLDER}
						element={<ScreenNestedFolder />}
					/>
					<Route path={Routes.SCREEN_PROPS} element={<ScreenPropsDemo />} />
					<Route
						path={Routes.SCREEN_RENDER_PROP_PATTERN}
						element={<ScreenRenderPropPattern />}
					/>
					<Route
						path={Routes.SCREEN_CHILDREN_PROP_PATTERN}
						element={<ScreenChildrenPattern />}
					/>
					<Route
						path={Routes.SCREEN_PROGRESSBAR}
						element={<ScreenProgressbar />}
					/>
					<Route
						path={Routes.SCREEN_MEMOIZATION}
						element={<ScreenMemoization />}
					/>
					<Route path={Routes.SCREEN_TIMER} element={<ScreenTimer />} />
					<Route path={Routes.SCREEN_STAR_RATING} element={<StartRating />} />
				</Route>
			</ReactRooutes>
		</BrowserRouter>
	);
}
