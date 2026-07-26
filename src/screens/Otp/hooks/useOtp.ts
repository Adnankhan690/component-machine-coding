import { useRef, useState, useEffect } from "react";

export default function useOtp() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    // const otpInputRef = useRef<HTMLInputElement[] | null>(null);
    const otpInputRef = useRef<HTMLInputElement[]>([]);
    const [disabledInput, setDisabledInput] = useState<boolean[]>(Array.from({ length: 6 }, (_, i) => i !== 0));

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value;
        const newOtp = [...otp];
        newOtp[idx] = (Number(val) % 10).toString();
        setOtp(newOtp);

        const newDisabledInput = [...disabledInput];
        newDisabledInput[idx + 1] = false;
        setDisabledInput(newDisabledInput);

        setTimeout(() => {
            otpInputRef.current?.[idx + 1]?.focus();
        }, 0)
    }

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "Backspace" && idx > 0) {
            const newOtp = [...otp];
            if (newOtp[idx] === "") {
                newOtp[idx - 1] = "";
                setOtp(newOtp);
                const newDisabledInput = [...disabledInput];
                newDisabledInput[idx] = true;
                setDisabledInput(newDisabledInput);
                otpInputRef.current[idx - 1]?.focus();
            } else {
                newOtp[idx] = "";
                setOtp(newOtp);
            }
        }
    }

    useEffect(() => {
        otpInputRef.current[0]?.focus();
    }, [])

    return {
        otp,
        handleInput,
        otpInputRef,
        handleKeyDown,
        disabledInput,

    }
}