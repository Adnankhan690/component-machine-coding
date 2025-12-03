import "./screen-memo.css";
import ScreenExanmpleOne from "./Example1/ScreenExampleOne";
import ScreenExanmpleTwo from "./Example2/ScreenExample2";
import ScreenExanmple3 from "./Example3/ScreenExample3";
import ScreenUseDebounce from "./ScreenUseDebounce/ScreenUseDebounce";
import ScreenUseCycle from "./ScreenUseCycle/ScreenUseCycle";

export default function ScreenMemoization() {
	return (
		<>
			<h2>ScreenMemoization</h2>
			<p>This is the ScreenMemoization Demo</p>
			<div className="screen-con">
				{/* <ScreenExanmpleOne /> */}
				{/* <ScreenExanmpleTwo /> */}
				{/* <ScreenExanmple3 /> */}

				{/* <ScreenUseDebounce /> */}

				<ScreenUseCycle />
			</div>
		</>
	);
}
