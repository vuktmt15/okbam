import "./index.scss";
import {Input} from "antd";
import {TextAreaProps} from "antd/es/input";

export function TextAreaInput(props: TextAreaProps): JSX.Element {
  return (
    <div className="textarea">
      <Input.TextArea autoSize={{minRows: 3, maxRows: 5}} {...props} />
    </div>
  );
}
