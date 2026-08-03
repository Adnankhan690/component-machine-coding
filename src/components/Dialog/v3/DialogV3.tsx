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
            onClose && onClose();
        }
    }

    useEffect(() => {
        const modalRoot = document.createElement("div");
        modalRoot.id = "modal-root";
        document.body.appendChild(modalRoot);

        setContainer(false);

        return () => {
            if (modalRoot && modalRoot.childNodes.length > 0) {
                modalRoot.remove();
            }
        }

    }, [])

    if (container || !show) return;

    return createPortal(
        <>
            <div ref={backdropRef} className="backdrop">
                <div ref={dialogRef} className="modal-container">
                    {/* <div className="dialog-close"> */}
                    <button ref={buttonRef} className="dialog-close" onClick={handleClose}>X</button>
                    {/* </div> */}
                    <div className="modal-body">

                    </div>
                </div>
            </div>
        </>,
        document.getElementById("modal-root") as HTMLElement
    )
}