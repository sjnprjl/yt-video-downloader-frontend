import { PropsWithChildren } from "react";
import cs from 'classnames';

interface BaseModalProps extends PropsWithChildren {
    open: boolean;
}
export function BaseModal(props: BaseModalProps) {
    const modalClass = cs({
        "modal modal-bottom sm:modal-middle": true,
        "modal-open": props.open,
    })
    return <div className={modalClass}>
        {/* we want any content for this modal layout so we just pass the children */}
        <div className="modal-box">{props.children}</div>
    </div>
}

interface ModalProps extends BaseModalProps {
    title?: string;
    description?: string;
}
export function Modal(props: ModalProps) {
    return <BaseModal open={props.open}>
        {props.title && <h3 className="font-bold text-lg">{props.title}</h3>}
        {props.description && <p className="py-4">{props.description}</p>}
        {props.children}
    </BaseModal>
}