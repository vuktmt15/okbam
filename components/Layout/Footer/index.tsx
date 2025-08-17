import clsx from "clsx";

interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Footer(props: FooterProps): JSX.Element {
  const {children, className} = props;

  return (
    <div
      className={clsx(
        "px-10 pb-9 fixed bottom-0 left-0 flex justify-center items-center h-16 mt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
