import "./index.scss";
import {Button, ButtonProps, Row} from "antd";
import clsx from "clsx";

interface ButtonSubmitProps extends ButtonProps {
  label: string;
  classRow?: string;
  typeButton?: "submit" | "danger";
}

export function ButtonSubmit(props: ButtonSubmitProps): JSX.Element {
  return (
    <Row className={`button-container ${props.classRow}`}>
      <Button
        className={clsx(
          "button custom-btn-submit",
          {"opacity-40": props.disabled},
          props.className,
          {"custom-btn-danger": props.typeButton === "danger"},
        )}
        type="primary"
        htmlType="submit"
        {...props}
      >
        {props.label}
      </Button>
    </Row>
  );
}
