import useStopWatchV3 from "./useStopWatchV3";

export default function StopWatchV3() {
    const {
        handlePause,
        handleStart,
        handleReset,
        time
    } = useStopWatchV3();

    return (
        <div>
            <p>Stop watch v3</p>
            <p></p>
            <div className="stop-watch-controls">
                <button>start</button>
                <button>pause</button>
                <button>reset</button>
            </div>
        </div>
    )
}