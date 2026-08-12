// import TimerV1 from "./components/timerV1";
import TimerV2 from "./componentsV2/timerV2";

export default function Timer() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Timer Screen</h1>
      <p>This is an empty placeholder screen for the Timer component.</p>
      {/* <TimerV1 /> */}
      <TimerV2 />
    </div>
  );
}
