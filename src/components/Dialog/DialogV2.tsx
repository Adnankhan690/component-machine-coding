import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface DialogV2 {
    show: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    children: React.ReactNode;
}

export default function DialogV2({
    show = true,
    onClose,
    onSubmit,
    children
}: DialogV2) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

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
            if (modalRoot && modalRoot.childNodes.length === 0) {
                modalRoot.remove();
            }
        }
    }, [])

    if (!container) return null;

    return createPortal(
        <>
            <div></div>
        </>,
        document.getElementById("modal-root") as HTMLElement
    )
}