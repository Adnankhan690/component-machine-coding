import CountDown from "./components/countDown/CountDown";
import Timer from "./components/stopWatch/Timer";

export default function ScreenTimer() {
	return (
		<div>
			<Timer />
			<hr />
			<CountDown />
		</div>
	);
}
