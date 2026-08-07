import Watch from "./components/watch";
import StopWatchV2 from "./components/stop-watch-v2";
import StopWatchV3 from "./componentsV3/StopWatchV3";

export default function StopWatch() {
	return (
		<div>
			<h1>Stop Watch</h1>
			{/* <Watch /> */}
			{/* <StopWatchV2 /> */}
			<StopWatchV3 />
		</div>
	);
}
