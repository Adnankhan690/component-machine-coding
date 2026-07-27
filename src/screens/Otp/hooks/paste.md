Edited Otp.tsx
Edited Otp.tsx
Edited useOtp.ts
Edited useOtp.ts
Edited useOtp.ts
Viewed useOtp.ts:28-71

The focus lands on the 2nd element because **both** `onPaste` and `onChange` (which calls `handleInput`) fire during a paste action:

### The Event Sequence:

1. **`onPaste` fires first:**
   - `handlePaste` executes and splits `"1234"` into `["1", "2", "3", "4"]`.
   - It calls `setOtp` and `setDisabledInput`.
   - It schedules a `setTimeout` to focus the **5th element** (`index 4`, because `pasteOtp.length` is 4).

2. **`onChange` fires immediately after:**
   - Because the browser's default action is to paste the text into the first input, the value of the first input changes.
   - This triggers the `onChange` event on the first input (`idx = 0`), invoking `handleInput(e, 0)`.
   - `handleInput` schedules a **second** `setTimeout` to focus the **2nd element** (`idx + 1`, which is `index 1`).

3. **The Event Loop Executes the Timeouts:**
   - Both timeouts fire at the end of the current event loop cycle.
   - The focus call from `handleInput` runs, overriding the focus and bringing it back to the **2nd element** (`index 1`).
   - Additionally, `handleInput` overwrites the first index of your OTP state back to just the last digit of the pasted string.

---

### How to Fix This:
To prevent the `onChange` event from firing during a paste, you need to call **`e.preventDefault()`** inside `handlePaste`. 

This tells the browser to cancel its default pasting behavior. Since the browser doesn't change the input value directly (your `setOtp` state update handles it instead), **`onChange` will never be triggered**:

```typescript
const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // <-- Prevents the browser's default paste and subsequent onChange event

    const paste = e.clipboardData.getData("Text").slice(0, 6);
    const pasteOtp = paste.split("");
    const newOtp = [...otp];
    const newDisabledInput = [...disabledInput];

    pasteOtp.forEach((val, idx) => {
        newOtp[idx] = val;
        newDisabledInput[idx + 1] = false;
    });
    setOtp(newOtp);
    setDisabledInput(newDisabledInput);

    setTimeout(() => {
        otpInputRef.current[pasteOtp.length]?.focus();
    }, 0);
}
```