import clsx from "clsx";
import {ButtonHTMLAttributes} from "react";

export function ButtonBlueText(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        "border-0 bg-white font-semibold text-base text-main-blue",
        props.className,
        {"opacity-40 cursor-not-allowed": props.disabled},
      )}
    >
      {props.children}
    </button>
  );
}
