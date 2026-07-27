//todo
//error case , 
// pasting values like this '1fg34'
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

        //it is done so that state is udpated 1st then focus is moved
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

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("Text").slice(0, 6);
        e.preventDefault();
        const pasteOtp = paste.split("");
        const newOtp = [...otp];
        const newDisabledInput = [...disabledInput];

        pasteOtp.forEach((val, idx) => {
            newOtp[idx] = val;
            newDisabledInput[idx + 1] = false;
        });
        setOtp(newOtp);
        setDisabledInput(newDisabledInput);

        const targetIndex = Math.min(paste.length, 5);
        setTimeout(() => {
            otpInputRef.current[targetIndex]?.focus();
        }, 0)
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
        handlePaste,

    }
}