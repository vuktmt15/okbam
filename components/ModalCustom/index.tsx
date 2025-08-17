import "./index.scss";
import {Modal, ModalProps} from "antd";
import clsx from "clsx";

export function ModalCustom(props: ModalProps): JSX.Element {
  return (
    <Modal
      centered
      footer={false}
      width="80%"
      {...props}
      className={clsx("modal-ant", props.className)}
    >
      {props.children}
    </Modal>
  );
}
