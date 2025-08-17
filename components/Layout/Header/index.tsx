import {LeftOutlined} from "@ant-design/icons";
import clsx from "clsx";
import React from "react";
import {useTranslation} from "react-i18next";

interface IHeaderProps {
  title?: string;
  handleBack?: () => void;
  isTitleBack?: boolean;
  className?: string;
  isBoxShadow?: boolean;
  iconRight?: React.ReactNode;
  onClickIconRight?: () => void;
  hideBackButton?: boolean;
}

export function Header({
  title,
  handleBack,
  isTitleBack,
  className,
  isBoxShadow,
  iconRight,
  onClickIconRight,
  hideBackButton,
}: IHeaderProps) {
  const {t} = useTranslation();

  return (
    <div
      className="sticky flex px-6 items-center top-0 bg-white left-0 h-12 w-full text-center"
      style={{
        boxShadow: isBoxShadow
          ? "0px 4px 20px 0px rgba(0, 0, 0, 0.08)"
          : "none",
      }}
    >
      <div
        role="presentation"
        className={clsx("flex items-center", {
          invisible: hideBackButton,
        })}
        onClick={handleBack}
      >
        <LeftOutlined className="text-xl leading-5" />
        {isTitleBack && (
          <span className="pl-2 text-lg font-semibold">{t("common.back")}</span>
        )}
      </div>

      <div className={clsx("m-auto", "text-lg", "font-semibold", className)}>
        {title}
      </div>
      {iconRight && (
        <div role="presentation" onClick={onClickIconRight}>
          {iconRight}
        </div>
      )}
    </div>
  );
}
