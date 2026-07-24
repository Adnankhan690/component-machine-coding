import { useState, useRef } from "react";

export default function useStopWatchV2() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

    const start = () => {
        if (intervalRef.current) return;
        const startDate = new Date().getTime() - time;
        setIsRunning(true);

        intervalRef.current = setInterval(() => {
            setTime(new Date().getTime() - startDate);
        }, 100)
    }

    const pause = () => {
        if (!intervalRef.current) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
    }

    const reset = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTime(0);
        setIsRunning(false);
    }

    const formatTime = () => {
        const ms = String(time % 1000).padStart(3, '0');
        const sec = String(Math.floor((time / 1000)) % 60).padStart(2, '0');
        const min = String(Math.floor(time / (60 * 1000)) % 60).padStart(2, '0');
        const hr = String(Math.floor(time / (60 * 60 * 1000)) % 24).padStart(2, '0');
        const day = String(Math.floor(time / (24 * 60 * 60 * 1000)) % 365).padStart(2, '0');

        return `${day}: ${hr}: ${min}: ${sec}: ${ms}`
    }

    return {
        time: formatTime(),
        start,
        pause,
        reset,
        isRunning,
        totalSeconds: time,
    }
}