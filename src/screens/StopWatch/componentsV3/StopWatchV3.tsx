import useStopWatchV3 from "./useStopWatchV3";

export default function StopWatchV3() {
    const {
        handlePause,
        handleStart,
        handleReset,
        time,
        formatTime
    } = useStopWatchV3();

    return (
        <div>
            <p>Stop watch v3</p>
            <p>{formatTime()}</p>
            <div className="stop-watch-controls">
                <button onClick={handleStart}>start</button>
                <button onClick={handlePause}>pause</button>
                <button onClick={handleReset}>reset</button>
            </div>
        </div>
    )
}