import useCounterV2 from "../hooks/useCounterV2";
import "./counterV2.css";

export default function CounterV2() {
    const {
        counter,
        handleIncrement,
        handleDecrement,
        inputCount,
        handleChangeCount,
        handleLimitChange,
        limit,
        onReset,
        onAsyncIncrement,
        onAsyncDecrement,
    } = useCounterV2();

    return (
        <div>
            <p>{counter}</p>
            <div className="counter-control-wrapper">
                <button onClick={handleIncrement}>+</button>
                <button onClick={handleDecrement}>-</button>
            </div>
            <div>
                <div>
                    <button onClick={onAsyncIncrement}>async +</button>
                    <button onClick={onAsyncDecrement}>async -</button>
                </div>
                <div>
                    <label htmlFor="count">Count : </label>
                    <input id="count" type="number" value={inputCount} onChange={handleChangeCount} />
                </div>
                <div>
                    <div>
                        <label>Lower Limit:</label>
                        <input value={limit.lower} type="number" onChange={(e) => handleLimitChange(e, 'lower')} />
                    </div>
                    <div>
                        <label>Upper Limit:</label>
                        <input value={limit.upper} type="number" onChange={(e) => handleLimitChange(e, 'upper')} />
                    </div>
                </div>
                <div>
                    <button onClick={onReset}>Reset</button>
                </div>
            </div>
        </div>
    )
}