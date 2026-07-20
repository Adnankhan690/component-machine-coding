import "./watch.css"
import { useState, useEffect, useRef } from "react"

export default function Watch() {
    const [time, setTime] = useState(0);
    const timerId = useRef<number | null>(null);

    const handleStart = () => {
        const timeInstance = new Date().getTime();
        timerId.current = setTimeout(() => {
            setTime((prev) => {
                const diff = (new Date().getTime() + time) - timeInstance;
                return diff;
            })
        }, 100)
    }

    useEffect(() => {
        if (timerId.current) {
            handleStart()
        }

        return () => {
            if (timerId.current) {
                clearTimeout(timerId.current)
            }
        }
    }, [time])


    // 312456ms
    // 1s = 1000ms
    // 1m = 60s = 60 * 1000ms
    // 1hr = 60m = 60 * 60s = 60 * 60 * 1000ms
    // 1day = 24hr = 24 * 60m = 24 * 60 * 60s = 24 * 60 * 60 * 1000ms

    //formula (right one goes as '/ (right_value) % restrict_value')
    // restrict_value = restricting units(ms, sec, min, hr) to its respective format

    const getFormattedTime = () => {
        const ms = (time % 1000);
        const seconds = String(Math.floor(time / 1000) % 60).padStart(2, '0');
        const minutes = String(Math.floor(time / (1000 * 60)) % 60).padStart(2, '0');
        const hours = String(Math.floor(time / (1000 * 60 * 60)) % 12).padStart(2, '0');
        const day = String(Math.floor(time / (24 * 60 * 60 * 1000)) % 365).padStart(2, '0');

        return `${day}: ${hours}: ${minutes}: ${seconds}: ${ms}`
    }

    const handlePause = () => {
        if (!timerId.current) return;
        clearTimeout(timerId.current);
        timerId.current = null;
    }

    const handleReset = () => {
        clearTimeout(timerId.current as unknown as number);
        timerId.current = null;
        setTime(0);
    }

    return (
        <div>
            {getFormattedTime()}
            <div className="button-wrapper">
                <button onClick={() => { handleStart() }}>Start</button>
                <button onClick={handlePause}>Pause</button>
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    )
}