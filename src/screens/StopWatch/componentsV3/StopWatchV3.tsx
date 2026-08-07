import useStopWatchV3 from "./useStopWatchV3";

export default function StopWatchV3() {
    const {
        handlePause,
        handleStart,
        handleReset,
        time,
        formatTime,
        isRunning
    } = useStopWatchV3();

    return (
        <div>
            <p>Stop watch v3</p>
            <p>{formatTime()}</p>
            <div className="stop-watch-controls">
                <button disabled={isRunning} onClick={handleStart}>start</button>
                <button disabled={!isRunning} onClick={handlePause}>pause</button>
                <button disabled={time === 0} onClick={handleReset}>reset</button>
            </div>
        </div>
    )
}