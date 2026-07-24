import { useEffect, useRef, useState } from 'react';

export default function useCounterV2() {
    const [counter, setCounter] = useState(0);
    const [inputCount, setInputCount] = useState(0);
    const [limit, setLimit] = useState<{ lower: number, upper: number }>({
        lower: -10,
        upper: 10,
    });
    const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const handleIncrement = () => {
        setCounter((prev) => {
            if (prev >= limit.upper) return prev;
            return prev + (inputCount || 1)
        });
    }

    const handleDecrement = () => {
        setCounter((prev) => {
            if (prev <= limit.lower) return prev;
            return prev - (inputCount || 1)
        });
    }

    const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputCount(Number(e.target.value))
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>, limitType: 'lower' | 'upper') => {
        const value = Number(e.target.value);

        setLimit((prev) => ({ ...prev, [limitType]: value }));
    }

    const handleReset = () => {
        setCounter(0);
        setInputCount(0);
        setLimit({
            lower: -10,
            upper: 10,
        })
    }

    const handleAsyncIncrement = () => {
        const timeoutId = setTimeout(() => {
            handleIncrement();
            if (timeoutRef.current) {
                // the condition only filters out the current timeout (timeoutId) that just finished.
                timeoutRef.current = timeoutRef.current.filter((tId) => tId !== timeoutId)
            }
        }, 3000)

        if (timeoutRef.current) {
            timeoutRef.current.push(timeoutId);
        }
    }

    const handleAsyncDecrement = () => {
        const timeoutId = setTimeout(() => {
            handleDecrement();
            if (timeoutRef.current) {
                timeoutRef.current = timeoutRef.current.filter((tId) => tId !== timeoutId)
            }
        }, 3000)

        if (timeoutRef.current) {
            timeoutRef.current.push(timeoutId);
        }
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                timeoutRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
            }
        }
    }, [])

    return {
        counter,
        handleIncrement,
        handleDecrement,
        inputCount,
        handleChangeCount,
        handleLimitChange,
        limit,
        onReset: handleReset,
        onAsyncIncrement: handleAsyncIncrement,
        onAsyncDecrement: handleAsyncDecrement,

    }
}