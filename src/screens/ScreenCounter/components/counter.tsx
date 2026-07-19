import { useState } from "react";
import "./counter.css"

export default function Counter() {
    const [counterValue, setCounterValue] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [limit, setLimit] = useState({
        min: "-10",
        max: "10"
    })

    const getSafeLimits = () => {
        const maxLimit = limit.max === "" ? Infinity : Number(limit.max);
        const minLimit = limit.min === "" ? -Infinity : Number(limit.min);

        return {
            max: maxLimit,
            min: minLimit
        }
    }

    const handleIncrement = () => {
        const { max: safeMax, } = getSafeLimits();

        if (counterValue >= safeMax) return;
        if (inputValue.trim() === '') {
            setCounterValue((prev) => prev + 1);
        } else {
            setCounterValue((prev) => prev + Number(inputValue));
        }
    }

    const handleDecrement = () => {
        const { min: safeMin } = getSafeLimits();

        if (counterValue <= safeMin) return;
        if (inputValue.trim() === '') {
            setCounterValue((prev) => prev - 1);
        } else {
            setCounterValue((prev) => prev - Number(inputValue));
        }
    }

    const handleReset = () => {
        setCounterValue(0);
        setInputValue("");
        setLimit({
            min: "-10",
            max: "10"
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const rawValue = e.target.value;
        const hasMinus = rawValue.startsWith('-');
        const digits = rawValue.replace(/[^\d]/g, '');
        const sanitized = (hasMinus ? '-' : '') + digits;

        setLimit((prev) => {
            return {
                ...prev,
                [type]: sanitized
            }
        })
    }

    return (
        <div className="counter-container">
            <h1>Counter</h1>
            <p>{counterValue}</p>
            <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Incr/decr by"
            />
            <div>
                <button onClick={handleIncrement}>Increment</button>
                <button onClick={handleDecrement}>Decrement</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <div>
                <label htmlFor="min">Min limit</label>
                <input
                    id="min"
                    value={limit.min}
                    onChange={(e) =>
                        handleLimitChange(e, 'min')
                    }
                />
            </div>
            <div>
                <label htmlFor="max">Max limit</label>
                <input
                    id="max"
                    value={limit.max}
                    onChange={(e) =>
                        handleLimitChange(e, "max")
                    }
                />
            </div>
            <div>
                <button onClick={() => setTimeout(() => handleIncrement(), 3000)}>async+</button>
                <button onClick={() => setTimeout(() => handleDecrement(), 3000)}>async-</button>
            </div>
        </div>
    )
}