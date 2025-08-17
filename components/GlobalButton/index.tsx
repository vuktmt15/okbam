import "./index.scss";
import clsx from "clsx";
import {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode} from "react";

interface GlobalButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
}

function GlobalButton({children, ...buttonProps}: GlobalButtonProps) {
  return (
    <button
      {...buttonProps}
      className={clsx("button-sso-wrapper", buttonProps.className)}
      type={buttonProps?.type || "button"}
    >
      {children}
    </button>
  );
}
export default GlobalButton;
