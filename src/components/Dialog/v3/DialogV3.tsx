import "./dialogV3.css";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

interface DialogV3Props {
    show: boolean;
    onClose: () => void,
    onSubmit?: () => void,
    children?: React.ReactNode,
}

export default function DialogV3({ children, onClose, onSubmit, show = false }: DialogV3Props) {

    const [container, setContainer] = useState(true);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleClose = () => {
        if (!backdropRef.current || !dialogRef.current) return;

        if (backdropRef.current && dialogRef.current) {
            backdropRef.current.classList.add('close-modal');
            dialogRef.current.classList.add('close-modal');
            setContainer(false);
            backdropRef.current.addEventListener('animationend', handleAnimationEnd, { once: true });
        }
    }

    const handleAnimationEnd = () => {
        onClose && onClose();
    }

    useEffect(() => {
        let modalRoot = document.getElementById("modal-root");
        let created = false;

        if (!modalRoot) {
            modalRoot = document.createElement("div");
            modalRoot.id = "modal-root";
            document.body.appendChild(modalRoot);
            created = true;
        }

        setContainer(false);

        return () => {
            if (created && modalRoot && modalRoot.childNodes.length > 0) {
                modalRoot.remove();
            }
        }
    }, [])

    useEffect(() => {
        const focusableSelector = 'input, select, textarea, a[href], button, [tabindex]:not([tabindex="-1"])';
        const focusableElements = dialogRef.current?.querySelectorAll(focusableSelector);

        const firstElement = focusableElements && focusableElements[0] as HTMLDivElement;
        const lastElement = focusableElements && focusableElements[focusableElements.length - 1] as HTMLDivElement;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
            if (e.key === "Tab") {
                const activeElement = document.activeElement;

                if (e.shiftKey && activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        }

        window.addEventListener("keydown", onKeyDown);

        firstElement?.focus();

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [show])

    if (container || !show) return;

    return createPortal(
        <>
            <div ref={backdropRef} className="backdrop">
                <div ref={dialogRef} className="modal-container">
                    {/* <div className="dialog-close"> */}
                    <button ref={buttonRef} className="dialog-close" onClick={handleClose}>X</button>
                    {/* </div> */}
                    <div className="modal-body">
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