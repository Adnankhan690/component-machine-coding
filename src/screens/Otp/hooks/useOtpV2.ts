import { useRef, useState } from "react";

export const OTP_LENGTH = 6;

export default function useOTPV2() {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const otpRef = useRef<HTMLInputElement[]>([]);
    const [disabledInput, setDisabledInput] = useState<boolean[]>(Array.from({ length: OTP_LENGTH }, (_, idx) => idx !== 0));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = Number(e.target.value) % 10;
        if (isNaN(val)) return;
        const newOtp = [...otp];
        newOtp[idx] = String(val);

        setOtp(newOtp);
        const newDisabledInput = [...disabledInput];
        newDisabledInput[idx + 1] = false;
        setDisabledInput(newDisabledInput)

        setTimeout(() => {
            otpRef.current[idx + 1]?.focus();
        }, 0)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            if (newOtp[idx] === "") {
                newOtp[idx - 1] = "";
                setOtp(newOtp);
                if (idx > 0) {
                    const newDisabledInput = [...disabledInput];
                    newDisabledInput[idx] = true;
                    setDisabledInput(newDisabledInput)
                }

                otpRef.current[idx - 1]?.focus();
            } else {
                newOtp[idx] = "";
                setOtp(newOtp);
            }
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const val = e.clipboardData.getData("Text").slice(0, 6);
        e.preventDefault();
        const paste = val.split("");
        const newOtp = [...otp];
        const newDisabled = [...disabledInput];

        paste.forEach((ps, idx) => {
            newOtp[idx] = ps;
            newDisabled[idx + 1] = false;
        })

        setDisabledInput(newDisabled);

        setOtp(newOtp);
        const minLen = Math.min(OTP_LENGTH - 1, paste.length);
        setTimeout(() => {
            otpRef.current[minLen]?.focus();
        }, 0)
        //123456
    }

    return {
        otp,
        handleChange,
        otpRef,
        handleKeyDown,
        disabledInput,
        handlePaste
    }
}