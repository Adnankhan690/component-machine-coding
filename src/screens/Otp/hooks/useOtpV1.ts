import { useState, useRef } from "react";

const OTP_LENGTH = 6;

export default function useOtpV1() {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const inputRef = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = (e.target.value);
        const newOtp = [...otp];
        newOtp[idx] = String(Number(value) % 10);

        setOtp(newOtp)

        setTimeout(() => {
            inputRef.current[idx + 1]?.focus();
        }, 0)

    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            if (otp[idx] === '') {
                e.preventDefault();
                inputRef.current[idx - 1]?.focus();
            }
        }
    }


    return {
        otp,
        inputRef,
        handleKeyDown,
        handleChange
    }
}