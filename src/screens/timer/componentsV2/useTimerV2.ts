import { useRef, useState } from "react";

export interface TimeInput {
    minute: string,
    second: string,
}

export default function useTimerV2() {
    const [input, setInput] = useState<TimeInput>({
        minute: '',
        second: '',
    });
    const [isRunning, setIsRunning] = useState(false);
    const timerIdRef = useRef<ReturnType<typeof setInterval>>(null);
    const initialTimeRef = useRef<number>(0);

    const handleStart = () => {
        const sec = Number(input.second);
        const min = Number(input.minute);

        let miliSecond = (sec * 1000) + (min * (60 * 1000));
        if (!miliSecond) return;

        setIsRunning(true);

        initialTimeRef.current = new Date().getTime() + miliSecond;

        timerIdRef.current = setInterval(() => {
            const newTime = initialTimeRef.current - new Date().getTime();
            const newSec = Math.floor((newTime / 1000) % 60);
            const newMinute = Math.floor((newTime / (60 * 1000)) % 60);

            const newInput: TimeInput = {
                minute: String(newMinute),
                second: String(newSec),
            }

            if (newTime < 0) {
                timerIdRef.current && clearInterval(timerIdRef.current);
                timerIdRef.current = null;
                setIsRunning(false);
                return;
            };

            setInput(newInput)
        }, 10)

    }

    const handlePause = () => {
        if (!timerIdRef.current) return;
        setIsRunning(false);

        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
    }

    //how to remove 0
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'minute' | 'second') => {
        const val = e.target.value;
        if (Number.isNaN(Number(val))) return;

        setInput((prev) => ({
            ...prev,
            [type]: val
        }))
    }

    return {
        handleStart,
        handlePause,
        handleInputChange,
        input,
        isRunning,
        timerIdRef,
    }
}