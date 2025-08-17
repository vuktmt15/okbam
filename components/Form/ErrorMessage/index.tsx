import "./index.scss";
import React from "react";
import {useTranslation} from "react-i18next";

function ErrorMessage({children}: {children?: string}) {
  const {t} = useTranslation();
  return children && <div className="text-errors-message">{t(children)}</div>;
}

export default ErrorMessage;
