import { useState } from "react";

export default function useTimerV1() {
    const [time, setTime] = useState<{ hours: number, min: number, sec: number, ms: number }>(
        {
            hours: 0,
            min: 2,
            sec: 0,
            ms: 0,
        }
    )


    const handleStart = () => {
        const currDate = new Date().getTime();
        const futureDate = currDate + (time.min * 60 * 1000) + (time.sec * 1000) + (time.ms);
        setInterval(() => {
            setTime((prev) => {
                const diffMs = futureDate - new Date().getTime();
                return {
                    ...prev,
                    min: Math.floor(diffMs / (1000 * 60)) % 60,
                    sec: Math.floor(diffMs / 1000) % 60,
                    ms: diffMs % 1000,
                }
            })

        }, 1000)
    }

    const handleChangeMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setTime((prev) => {
            return {
                ...prev,
                min: value,
            }
        })

    }
    const handleChangeSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setTime((prev) => {
            return {
                ...prev,
                sec: value,
            }
        })
    }

    const handleChangeHour = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setTime((prev) => {
            return {
                ...prev,
                hours: value,
            }
        })
    }

    return {
        time,
        onStart: handleStart,
        onChangeSecond: handleChangeSeconds,
        onChangeMinute: handleChangeMinute,
        onChangeHour: handleChangeHour,
    }
}