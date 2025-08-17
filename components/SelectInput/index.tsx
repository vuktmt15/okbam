import "./index.scss";
import {removeDiacritics} from "@app/utils";
import {Select, SelectProps} from "antd";
import clsx from "clsx";

export function SelectInput(props: SelectProps) {
  const filterSelectSearch = (inputValue: string, options: string) => {
    return removeDiacritics(options)?.includes(removeDiacritics(inputValue));
  };

  return (
    <Select
      filterOption={(inputValue, option): boolean =>
        filterSelectSearch(inputValue, option?.label as string)
      }
      {...props}
      className={clsx(props.className)}
    />
  );
}
