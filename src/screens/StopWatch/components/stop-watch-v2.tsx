import useStopWatchV2 from "../hooks/useStopWatchV2";

export default function StopWatchV2() {
    const {
        time,
        start,
        pause,
        reset,
        isRunning,
        totalSeconds,
    } = useStopWatchV2();

    return (
        <div>
            <p>{time}</p>
            <div>
                <button disabled={isRunning} onClick={start}>start</button>
                <button disabled={!isRunning} onClick={pause}>pause</button>
                <button disabled={totalSeconds === 0} onClick={reset}>reset</button>
            </div>

        </div>
    )
}