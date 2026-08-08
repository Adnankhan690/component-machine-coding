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
    const timerIdRef = useRef<ReturnType<typeof setInterval>>(null);
    const initialTimeRef = useRef<number>(0);

    const handleStart = () => {
        // if (!initialTimeRef.current) return;

        const sec = Number(input.second);
        const min = Number(input.minute);

        let miliSecond = (sec * 1000) + (min * (60 * 1000));


        initialTimeRef.current = new Date().getTime() + miliSecond;

        timerIdRef.current = setInterval(() => {
            const newTime = initialTimeRef.current - new Date().getTime();
            const newSec = Math.floor((newTime / 1000) % 60);
            const newMinute = Math.floor((newTime / (60 * 1000)) % 60);

            const newInput: TimeInput = {
                minute: String(newMinute),
                second: String(newSec),
            }

            setInput(newInput)
        }, 10)

    }

    // console.log("ad")

    const handlePause = () => {

    }

    //how to remove 0
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'minute' | 'second') => {
        const val = e.target.value;
        if (Number.isNaN(Number(val))) return;

        setInput((prev) => ({
            ...prev,
            [type]: Number(val)
        }))
    }

    return {
        handleStart,
        handlePause,
        handleInputChange,
        input,
    }
}