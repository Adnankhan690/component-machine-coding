import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function DialogV2() {
    // useEffect(() => {
    //     const modalRoot = document.createElement("div");
    //     modalRoot.id = "modal-root";

    //     document.body.appendChild(modalRoot);

    // }, [])

    useEffect(() => {
        const modalRoot = document.createElement("div");
        modalRoot.id = "modal-root";
        document.body.appendChild(modalRoot);

        return () => {
            if (modalRoot && modalRoot.parentNode) {
                modalRoot.parentNode.removeChild(modalRoot);
            }
        };
    }, []);

    return createPortal(
        <>
            <div></div>
        </>,
        document.getElementById("modal-root") as HTMLElement
    )
}