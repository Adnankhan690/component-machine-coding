import useTimerV2 from "./useTimerV2"

export default function TimerV2() {
    const {
        input,
        handleStart,
        handlePause,
        handleInputChange,
        isRunning,
    } = useTimerV2();

    return (
        <div>
            <div>
                <label htmlFor="minute" >Minute</label>
                <input
                    id="minute"
                    value={input['minute']}
                    // type="number"
                    onChange={(e) => handleInputChange(e, 'minute')}
                />
                <label htmlFor="second" >Minute</label>
                <input
                    id="second"
                    value={input.second}
                    // type="number"
                    onChange={(e) => handleInputChange(e, 'second')}
                />
            </div>
            <div>
                <button disabled={isRunning} onClick={handleStart}>start</button>
                <button disabled={!isRunning} onClick={handlePause}>pause</button>
            </div>
        </div>
    )
}