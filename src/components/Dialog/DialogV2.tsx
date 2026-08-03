import "./dialogV2.css";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

interface DialogV2 {
    show: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    children: React.ReactNode;
}

export default function DialogV2({
    show = false,
    onClose,
    onSubmit,
    children
}: DialogV2) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);


    const handleClose = () => {
        if (backdropRef.current && dialogRef.current) {
            backdropRef.current.classList.add("close-modal");
            dialogRef.current.classList.add("close-modal");
            dialogRef.current.addEventListener("animationend", handleAnimationEnd, { once: true });
        }
    }

    const handleAnimationEnd = () => {
        onClose && onClose();
    }

    //add a root-div for modals using portal
    useEffect(() => {
        let created = false;

        let modalRoot = document.getElementById("modal-root") as HTMLDivElement;

        if (!modalRoot) {
            modalRoot = document.createElement("div");
            modalRoot.id = "modal-root";

            document.body.appendChild(modalRoot);
            created = true;
        }

        setContainer(modalRoot);

        return () => {
            if (created && modalRoot && modalRoot.childNodes.length === 0) {
                modalRoot.remove();
            }
        }
    }, [])

    //trap-the-focus
    useEffect(() => {
        const focusableSelectors =
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements =
            dialogRef.current?.querySelectorAll(focusableSelectors);
        const firstFocusableElement = focusableElements && focusableElements[0] as HTMLElement;

        const lastFocusableElement =
            focusableElements && focusableElements[focusableElements.length - 1] as HTMLElement;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && show) {
                handleClose();
            }
            if (e.key === "Tab") {
                // Check which element currently has focus
                const activeElement = document.activeElement;

                if (e.shiftKey && activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement?.focus(); // Wrap around to end
                } else if (!e.shiftKey && activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement?.focus(); // Wrap around to start
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);
        (firstFocusableElement as HTMLElement)?.focus();

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [show]);


    if (!container || !show) return null;

    return createPortal(
        <>
            <div className="backdrop" ref={backdropRef}>
                <div className="dialog-container" ref={dialogRef}>
                    <button ref={closeBtnRef} onClick={handleClose} className="dialog-close">X</button>
                    <div className="children">
                        <p>title</p>
                        <div>
                            Contrary to popular belief, Lorem Ipsum is not simply random text.
                            It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
                            Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,
                            looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
                            and going through the cites of the word in classical literature, discovered the undoubtable source.
                            Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
                            (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics,
                            very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                            comes from a line in section 1.10.32.
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.getElementById("modal-root") as HTMLElement
    )
}