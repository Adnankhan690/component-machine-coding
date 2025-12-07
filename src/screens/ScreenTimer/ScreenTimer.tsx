import "./time-screen.css";
import CountDown from "./components/countDown/CountDown";
import DigitalClock from "./components/DigitalClock/DigitalClock";
import Timer from "./components/stopWatch/Timer";

export default function ScreenTimer() {
	return (
		<div className="time-con">
			<Timer />
			<hr />
			<CountDown />
			<hr />
			<DigitalClock />
		</div>
	);
}
