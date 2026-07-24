import useTimerV1 from "../hooks/useTimerV1";

export default function TimerV1() {
    const {
        onStart,
        onChangeMinute,
        onChangeSecond,
        time,
    } = useTimerV1();

    return (
        <div>
            TimerV1
            <div>
                <input type="number" value={time.min} onChange={onChangeMinute} />
                <input type="number" value={time.sec} onChange={onChangeSecond} />
            </div>
            <div>
                <button onClick={onStart}>Start timer</button>
            </div>

        </div>
    )
}