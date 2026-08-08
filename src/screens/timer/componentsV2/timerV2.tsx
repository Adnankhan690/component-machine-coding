import useTimerV2 from "./useTimerV2"

export default function TimerV2() {
    const {
        input,
        handleStart,
        handlePause,
    } = useTimerV2();

    return (
        <div>
            <div>
                <label htmlFor="minute" >Minute</label>
                <input id="minute" value={input['minute']} type="number" />
                <label htmlFor="second" >Minute</label>
                <input id="second" value={input.second} type="number" />
            </div>
            <div>
                <button onClick={handleStart}>start</button>
                <button onClick={handlePause}>pause</button>
            </div>
        </div>
    )
}