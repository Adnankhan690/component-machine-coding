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

    const formatTime = () => {
        const second = Math.floor((time / 1000) % 60).toString().padStart(2, "0");
        const minutes = (time / (1000 * 60) % 60)
    }

    return {
        time,
        handleStart,
        handlePause,
        handleReset,
    }
}