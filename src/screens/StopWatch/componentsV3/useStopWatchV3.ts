import { useRef, useState } from "react";

export default function useStopWatchV3() {
    const [time, setTime] = useState(0);
    const timeRef = useRef<number>(0);

    const handleStart = () => {
        const timerId = setInterval(() => {
            const ms = new Date().getTime();

            setTime(ms)
        }, 10)

    }

    const handlePause = () => {

    }

    const handleReset = () => {

    }

    return {
        time,
        handleStart,
        handlePause,
        handleReset,
    }
}