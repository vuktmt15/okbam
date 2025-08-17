import {DatePicker, DatePickerProps} from "antd";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React from "react";

export function DatePickerInput(props: DatePickerProps) {
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  return <DatePicker format="DD/MM/YYYY" {...props} />;
}
