import { useState } from "react";

export interface TimeInput {
    minute: number,
    second: number,
}

export default function useTimerV2() {
    const [input, setInput] = useState<TimeInput>({
        minute: 0,
        second: 0,
    });

    const handleStart = () => {

    }

    const handlePause = () => {

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'minute' | 'seconds') => {
        const val = e.target.value;

        setInput((prev) => ({
            ...prev,
            [type]: Number(val)
        }))
    }

    return {
        handleStart,
        handlePause,
        handleInputChange,
        input
    }
}